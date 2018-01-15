var s = function( sketch ) {

  var lx = [-7, -24, -38, -72, -95, -84, -44, -35, -64, -95, -116, -94, -52, -20, 8, 29, 69, 35+69, 73+69, 106+69, 102+69, 64+69, 26+69, 17+69, 59+69, 91+69, 76+69, 36+69, 67, 38, 15, 0]
  var ly = [48, 88, 119, 130, 98, 67, 67, 95, 121, 103, 64, 24, 26, 53, 81, 99, 103, 98, 87, 89, 10+89, 109, 92, 56, 47, 66, 103, 118, 109, 80, 45, 23]
  
  var lsx = [];
  var lsy = [];

  var RG = Packages.geomerative;

  sketch.setup = function () {
    sketch.createCanvas(800, 800);
    sketch.frameRate(30);

    print(lx.length)
    print(ly.length)

    var n = 32;
    for(var i = 0; i < n; i++) {
      var x0 = lx[i];
      var x1 = lx[(i+1)%n];
      var x2 = lx[(i+2)%n];
      var x3 = lx[(i+3)%n];
      var y0 = ly[i];
      var y1 = ly[(i+1)%n];
      var y2 = ly[(i+2)%n];
      var y3 = ly[(i+3)%n];
      var t0 = 0;
      var t1 = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0)) + t0;
      var t2 = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)) + t1;
      var t3 = Math.sqrt((x3-x2)*(x3-x2)+(y3-y2)*(y3-y2)) + t2;
      
      for(var j = 0; j < 42; j++) {
        var t = sketch.map(j, 0, 42, t1, t2);
        var ax1 = (t1-t)/(t1-t0)*x0 + (t-t0)/(t1-t0)*x1;
        var ax2 = (t2-t)/(t2-t1)*x1 + (t-t1)/(t2-t1)*x2;
        var ax3 = (t3-t)/(t3-t2)*x2 + (t-t2)/(t3-t2)*x3;
        var bx1 = (t2-t)/(t2-t0)*ax1 + (t-t0)/(t2-t0)*ax2;
        var bx2 = (t3-t)/(t3-t1)*ax2 + (t-t1)/(t3-t1)*ax3;
        var cx = (t2-t)/(t2-t1)*bx1 + (t-t1)/(t2-t1)*bx2;

        var ay1 = (t1-t)/(t1-t0)*y0 + (t-t0)/(t1-t0)*y1;
        var ay2 = (t2-t)/(t2-t1)*y1 + (t-t1)/(t2-t1)*y2;
        var ay3 = (t3-t)/(t3-t2)*y2 + (t-t2)/(t3-t2)*y3;
        var by1 = (t2-t)/(t2-t0)*ay1 + (t-t0)/(t2-t0)*ay2;
        var by2 = (t3-t)/(t3-t1)*ay2 + (t-t1)/(t3-t1)*ay3;
        var cy = (t2-t)/(t2-t1)*by1 + (t-t1)/(t2-t1)*by2;

        lsx.push(cx);
        lsy.push(cy);
        // lsx.push(sketch.lerp(lx[i], lx[(i+1)%n], j / 42));
        // lsy.push(sketch.lerp(ly[i], ly[(i+1)%n], j / 42));
      }
    }
  }

  sketch.draw = function () {
    var g = sketch.ledGraphics;
    g.beginDraw();
    g.background(0);
    // sketch.translate(sketch.width / 2, sketch.height / 2);
    // g.fill(255);
    g.translate(sketch.width/2, sketch.height/2);
    // g.rotate(sketch.millis() * 0.001);
    g.colorMode(sketch.HSB, 100);
    // g.fill(sketch.millis() * 0.1 % 100, 100, 100);

    var n = 32;
    for(var i = 0; i < n; i++) {
      g.fill(0, 0, 100);
      if(i == 0)
      g.fill(0, 100, 100);
      g.rotate(1 / n * 2 * sketch.PI);
      // g.ellipse(256, 0, 5, 5);
      // g.ellipse(256, 0, 2, 2);
    }

    g.fill(0, 0, 100);
    g.noStroke();
    g.blendMode(sketch.ADD);
    // g.stroke(0, 0, 100);
    for(i = 0; i < lsx.length; i++) {
      // g.ellipse(lsx[i], lsy[i], 1, 1)
      // continue;


      var x = 256 * sketch.cos((i+90) / lsx.length * 2 * sketch.PI);
      var y = 256 * sketch.sin((i+90) / lsx.length * 2 * sketch.PI);
      // if(parseInt(sketch.millis()/10) % lsx.length == i) {
      // g.line(lsx[i], lsy[i], x, y)
      // }
      // else g.point(lsx[i], lsy[i]);
      // var t = sketch.map(sketch.mouseX, 0, sketch.width, 0, 100);
      var t = sketch.millis()/100 % 100;
      var th = sketch.map(lsx[i], -200, 200, 0, 100);
      var l = 20;
      if(t < th && t > th - l) {
        var p = t - (th-l/2);
        p = Math.abs(p);
        p = sketch.map(p, 0, l/2, 0, 50);
        g.fill(0, 100, p);
        g.ellipse(x, y, 5, 5);
        g.fill(0, 100, 100);
      g.ellipse(lsx[i], lsy[i], 1, 1)
    }

      var t = sketch.millis()/100 % 100;
      var th = sketch.map(lsx[i], -200, 200, 100, 0);
      if(t < th && t > th - l) {
        var p = t - (th-l/2);
        p = Math.abs(p);
        p = sketch.map(p, 0, l/2, 0, 5);
        g.fill(50, 100, p);
        g.ellipse(x, y, 5, 5);
      }
    }

    g.stroke(100,100,100);

    g.endDraw();
    // print(sketch.frameRate());
  };
};

var myp5 = new p5(s);
