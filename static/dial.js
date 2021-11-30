let center;
let diam = 100;
let theta;
let mx = 43;
let my = 0;
let ang = 0;
angle = ang;
function setup() {
  var myCanvas = createCanvas(150, 150);
  myCanvas.parent("dial");
  center = [width/2,height/2];
  theta = 2*PI/4;

}

function draw() {

  rectMode(CENTER);
  stroke(150);
  strokeWeight(1);
  fill(255);
  circle(center[0],center[1],diam);
  fill(245, 87, 34);
  noStroke();
  if(my>=0){
  circle(center[0]+(diam/4)*sin(theta), center[1]+(diam/4)*cos(theta), 40);
    }else{
  circle(center[0]-(diam/4)*sin(theta), center[1]-(diam/4)*cos(theta), 40);
    }


  if(mouseIsPressed){
    mx = mouseX-center[0];
    my = mouseY - center[1];

      if(pow(mouseX-center[0], 2) + pow(mouseY-center[1], 2) < pow(diam*2/3,2)){
          print(mx, my);
      theta = atan(mx/my);

    if(my>=0){
      if(mx>=0){
        ang=270+abs(int(degrees(theta)));
  }else{
    ang = 270-abs(int(degrees(theta)));
    // print('bottom left quadrant');
  }
    }else{
        if(mx>=0){
          ang = 90-abs(int(degrees(theta)));
      // print('top right quadrant');
    }else{
      ang = 90+abs(int(degrees(theta)));
      // print('top left quadrant');
    }
    }
    ang = littleEndian(ang);

      if(ang != undefined && cubeControl == true && xgo != undefined){
        print("angle: " + ang[0] + "," + ang[1]);
        angle = ang;
      changeAngle(ang);
    }
   }
  }

//output is the angle (theta)


}
