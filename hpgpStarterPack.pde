import geomerative.*;

import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptContext;
import javax.script.ScriptException;
import javax.script.Invocable;

import java.lang.NoSuchMethodException;
import java.lang.reflect.*;

import java.util.ArrayList;
import java.util.List;

import java.io.IOException;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import processing.awt.PSurfaceAWT;

private static ScriptEngineManager engineManager;
private static ScriptEngine nashorn;

public static String VERSION = "0.1";

private static ArrayList<String> scriptPaths = new ArrayList<String>();
private static long prevModified;

public String drawMode = "p2d"; // "p2d" / "webgl"
public int newWidth, newHeight;

public PApplet that = this;

float frameRate() {
  return frameRate;
}

FancyFixtures fancyFixtures;
public PGraphics ledGraphics;
PGraphics guiCanvas;

int[] gammatable = new int[256];
float gamma = 3.2; // 3.2 seems to be nice

void setup(){
  RG.init(this);
    size(800, 800, P2D);
    frameRate(60);
    ledGraphics = createGraphics(width, height, P2D);
    guiCanvas = createGraphics(width, height, P2D);
    fancyFixtures = new FancyFixtures(this);
    fancyFixtures.loadFile("hpgp_dislodge.xml");
    makeGammaTable();

    scriptPaths.add(sketchPath("data/sketch.js"));

    initNashorn();
}

void draw(){
    background(0);
    guiCanvas.beginDraw();
    guiCanvas.clear();
    fancyFixtures.drawMap(guiCanvas);
    guiCanvas.endDraw();

    pushMatrix();
    try {
      readFiles(scriptPaths);
    }
    catch (IOException e) {
      e.printStackTrace();
    }
    stroke(255);
    background(0);
  
    try {
      nashorn.eval("for(var prop in pApplet) {if(!this.isReservedFunction(prop)) {alternateSketch[prop] = pApplet[prop]}}");
      if (drawMode == "webgl") {
        translate(width / 2, height / 2);
      }
      nashorn.eval("alternateSketch.draw();");
    }
    catch (ScriptException e) {
      e.printStackTrace();
    }

    //ledGraphics.beginDraw();
    //ledGraphics.background(0);
    //ledGraphics.fill(255,0,20);
    //ledGraphics.ellipse(mouseX, mouseY, 20, 20);

    //ledGraphics.endDraw();
    image(ledGraphics, 0, 0);

    fancyFixtures.update(ledGraphics);
    popMatrix();

    //image(guiCanvas, 0, 0);
}

void makeGammaTable(){
    for (int i=0; i < 256; i++) {
        gammatable[i] = (int)(pow((float)i / 255.0, gamma) * 255.0 + 0.5);
    }
}

private static byte[] encoded;
public static String readFile(String path) throws IOException {
  long lastModified = Files.getLastModifiedTime(Paths.get(path)).toMillis();
  if (prevModified < lastModified || encoded == null) {
    encoded = Files.readAllBytes(Paths.get(path));
    println("updated at " + lastModified);
    prevModified = lastModified;

    try {
      nashorn.eval("for(var prop in pApplet) {if(!this.isReservedFunction(prop)) {alternateSketch[prop] = pApplet[prop]}}");
      nashorn.eval(new String(encoded, StandardCharsets.UTF_8));
      nashorn.eval("alternateSketch.setup();");
      print("script loaded in java");
    }
    catch (ScriptException e) {
      e.printStackTrace();
    }
  }
  return new String(encoded, StandardCharsets.UTF_8);
}

public void readFiles(ArrayList<String> paths) throws IOException {
  long lastModified = 0;
  for (String path : paths) {
    long modified = Files.getLastModifiedTime(Paths.get(path)).toMillis();
    if (modified > lastModified) lastModified = modified;
  }
  if (prevModified < lastModified || encoded == null) {
    println("updated at " + lastModified);
    prevModified = lastModified;

    try {
      nashorn.eval("for(var prop in pApplet) {if(!this.isReservedFunction(prop)) {alternateSketch[prop] = pApplet[prop]}}");
    }
    catch (ScriptException e) {
      e.printStackTrace();
    }
    for (String path : paths) {
      encoded = Files.readAllBytes(Paths.get(path));

      try {
        nashorn.eval(new String(encoded, StandardCharsets.UTF_8));
      }
      catch (ScriptException e) {
        e.printStackTrace();
      }
    }
    try {
      nashorn.eval("alternateSketch.setup();");
      surface.setSize(newWidth, newHeight);
    }
    catch (ScriptException e) {
      e.printStackTrace();
    }
  }
}