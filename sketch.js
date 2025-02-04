let video;
let faceMesh1;
let faces = [];
let triangles;
let uvCoords;
let img;
let x,y;
let fcamMode = true;
let flipButton;
let captureButton;


function preload() {
  faceMesh1 = ml5.faceMesh({ maxFaces: 1 });
  img = loadImage("assets/grid001.png");
}


function gotFaces(results) {
  faces = results;
}

function setup() {
  createCanvas(480,640, WEBGL);
  flipButton=createButton("Switch");
  flipButton.position(10,600);
  flipButton.mousePressed(FlipCam);
  captureButton=createButton("Capture");
  captureButton.position(10,550);
  captureButton.mousePressed(Capture);
  let constraints = {
    video : {
      facingMode:"user"
    },
    audio : false
  };
  video = createCapture(constraints);
  video.hide();
  faceMesh1.detectStart(video, gotFaces);
  triangles = faceMesh1.getTriangles();
  uvCoords = faceMesh1.getUVCoords();
}


function Capture(){
  saveCanvas('pic00','png');
}


async function FlipCam() {
  stopCamera();
  setTimeout(()=>{
    
    if(fcamMode){
      startCamera("environment");
    } else {
      startCamera("user");
    }
    fcamMode=!fcamMode;
    
  }, 600)
  
  
}


function startCamera(cameraMode) {
  
    let constraints = {
    video : { facingMode:cameraMode },
    audio : false
    };
    video = createCapture(constraints);
    video.hide(); // Hide default HTML element
    
    faceMesh1.detectStart(video, gotFaces);
    triangles = faceMesh1.getTriangles();
    uvCoords = faceMesh1.getUVCoords();
}

async function stopCamera() {
    if (video) {
        let stream = video.elt.srcObject;
        if (stream) {
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop()); // Stop all tracks
        }
        video.remove(); // Remove the video element
        video = null;
    }
    if (faceMesh1){
      faceMesh1.detectStop();
    }
}


function draw() {
  translate(-width / 2, -height / 2);
  background(0);
  if (video){
  image(video, 0, 0,width,height);}
  if (faces.length > 0) {
    let face = faces[0];
    texture(img);
    textureMode(NORMAL);
    noStroke();
    beginShape(TRIANGLES);
    for (let i = 0; i < triangles.length; i++) {
      let tri = triangles[i];
      let [a, b, c] = tri;
      let pointA = face.keypoints[a];
      let pointB = face.keypoints[b];
      let pointC = face.keypoints[c];
      let uvA = uvCoords[a];
      let uvB = uvCoords[b];
      let uvC = uvCoords[c];

      vertex(pointA.x, pointA.y, uvA[0], uvA[1]);
      vertex(pointB.x, pointB.y,  uvB[0], uvB[1]);
      vertex(pointC.x, pointC.y,  uvC[0], uvC[1]);
    }
    endShape();
  }
}
