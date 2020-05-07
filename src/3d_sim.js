import * as THREE from "../node_modules/three/build/three.module.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

import {
  animateClockwise,
  animateCounterClockwise,
} from "./animations/servo.js";

import {
  animateRight,
  animateLeft,
  animateBackward,
  animateForward,
} from "./animations/motor.js";

import { loadSensor, loadObject } from "./helpers/partsLoader.js";
import {
  resizeRendererToDisplaySize,
  onWindowResize,
  resizeCameraControls,
} from "./helpers/resizeFuncs.js";

import globalVals from "./globalVars.js";

const fov = 100; // field of view
const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
const near = 0.1;
const far = 1000;

const objCanvas = document.querySelector("#objGrid");
const objCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const objControls = new OrbitControls(objCamera, objCanvas);
const objScene = new THREE.Scene();
const objRenderer = new THREE.WebGLRenderer({ canvas: objCanvas });

const sensorCanvas = document.querySelector("#sensorGrid");
const sensorCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const sensorControls = new OrbitControls(sensorCamera, sensorCanvas);
const sensorScene = new THREE.Scene();
const sensorRenderer = new THREE.WebGLRenderer({ canvas: sensorCanvas });

const { animations, objects, sensors } = globalVals;
const servoFiles = [
  { name: "horn", color: 0xffffff },
  { name: "servo", color: 0x0055ff },
];
const motorFiles = [
  { name: "wheel", color: 0x696969 },
  { name: "wheel", color: 0x696969 },
  { name: "motor", color: 0x0055ff },
];
const ultrasonic = [{ name: "ultrasonic", color: 0x696969 }];
// Add animation when generating a function
animations.push(false);
animations.push(false);

objMain();
loadObject(0, "servo", servoFiles, objScene, objCamera, objControls);
loadObject(1, "motor", motorFiles, objScene, objCamera, objControls);
sensorMain();
loadSensor(
  0,
  "ultrasonic",
  ultrasonic,
  sensorScene,
  sensorCamera,
  sensorControls
);

sensorCanvas.style.display = "none";

$("#sensors").on("show.bs.collapse", function () {
  sensorCanvas.style.display = "initial";
  sensorCanvas.style.height = objCanvas.clientHeight + "px";
  resizeRendererToDisplaySize(sensorRenderer);
});

$("#sensors").on("hide.bs.collapse", function () {
  sensorCanvas.style.display = "none";
});

//********************** SLIDER ************************/
const range = document.getElementById("range"),
  rangeV = document.getElementById("sensorSlider"),
  setValue = () => {
    const newValue = Number(
        ((range.value - range.min) * 100) / (range.max - range.min)
      ),
      newPosition = 10 - newValue * 0.2;
    rangeV.innerHTML = `<span>${range.value}</span>`;
    rangeV.style.left = `calc(${newValue}% + (${newPosition}px))`;
  };
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener("input", setValue);

//********************** SLIDER ************************/

document.getElementById("anim1").onclick = function () {
  resetAnimation(0, "servo");
  changePlayButton();
  objects[0].forEach((val) => {
    val.visible = true;
  });
  objects.forEach((val, index) => {
    if (index !== 0 && val != undefined) {
      val.forEach((obj) => {
        obj.visible = false;
      });
    }
  });
  animations.forEach((val, index) => {
    if (index !== 0 && val != undefined) {
      animations[index] = false;
    }
  });
  document.getElementById("play").onclick = function () {
    if (globalVals.isReset) {
      resetAnimation(0, "servo");
    }
    changePlayButton();
    animateClockwise((90 * Math.PI) / 180, 0, objects);
  };
};

document.getElementById("anim2").onclick = function () {
  resetAnimation(1, "motor");
  changePlayButton();
  objects[1].forEach((val) => {
    val.visible = true;
  });
  objects.forEach((val, index) => {
    if (index !== 1 && val != undefined) {
      val.forEach((obj) => {
        obj.visible = false;
      });
    }
  });
  animations.forEach((val, index) => {
    if (index !== 1) {
      animations[index] = false;
    }
  });
  document.getElementById("play").onclick = function () {
    if (globalVals.isReset) {
      resetAnimation(1, "motor");
    }
    changePlayButton();
    animateRight(globalVals.timeStamp, 5, 1);
  };
};

document.getElementById("sensor1").onclick = function () {
  sensorControls.reset();

  sensors[0].forEach((val) => {
    val.visible = true;
  });
  sensors.forEach((val, index) => {
    if (index !== 0 && val != undefined) {
      val.forEach((obj) => {
        obj.visible = false;
      });
    }
  });
};

function changePlayButton() {
  const playID = document.getElementById("play");
  const { isPlay, isReset } = globalVals;
  if (!isPlay && !isReset) {
    playID.innerHTML = "Pause";
    globalVals.isPlay = true;
  } else if (isPlay && !isReset) {
    playID.innerHTML = "Resume";
    globalVals.isPlay = false;
  } else {
    playID.innerHTML = "Play";
    globalVals.isReset = false;
    globalVals.isPlay = false;
  }
}

function resetAnimation(objIndex, animation) {
  animations[objIndex] = true;
  globalVals.isPlay = false;
  globalVals.isReset = true;
  const obj = objects[objIndex];
  switch (animation) {
    case "servo":
      objControls.reset();
      obj[0].rotation.y = 0;
      break;
    case "motor":
      objControls.reset();
      globalVals.timeStamp = globalVals.currTime;
      obj[0].rotation.x = 0;
      obj[1].rotation.x = 0;
      break;
  }
}

function objMain() {
  objCamera.position.z = 50;
  if (resizeRendererToDisplaySize(objRenderer)) {
    const canvas = objRenderer.domElement;
    objCamera.aspect = canvas.clientWidth / canvas.clientHeight;
    objCamera.updateProjectionMatrix();
  }

  objControls.target.set(0, 5, 0);
  objControls.update();

  objScene.background = new THREE.Color(0xcccccc);
  objScene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  /*
   * ------------- LIGHTING ------------
   */
  const light_d1 = new THREE.DirectionalLight(0xffffff);
  light_d1.position.set(1, 1, 1);
  objScene.add(light_d1);

  const light_d2 = new THREE.DirectionalLight(0x002288);
  light_d2.position.set(-1, -1, -1);
  objScene.add(light_d2);

  const light_a = new THREE.AmbientLight(0x222222);
  objScene.add(light_a);
  /*
   * ------------- LIGHTING ------------
   */
  window.addEventListener(
    "resize",
    function () {
      onWindowResize(objRenderer, objCamera, objScene);
    },
    false
  );
  objRender();
}

function sensorMain() {
  sensorCamera.position.z = 50;
  if (resizeRendererToDisplaySize(sensorRenderer)) {
    const canvas = sensorRenderer.domElement;
    sensorCamera.aspect = canvas.clientWidth / canvas.clientHeight;
    sensorCamera.updateProjectionMatrix();
  }

  sensorControls.target.set(0, 5, 0);
  sensorControls.update();

  sensorScene.background = new THREE.Color(0xcccccc);
  sensorScene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  /*
   * ------------- LIGHTING ------------
   */

  const light_d1 = new THREE.DirectionalLight(0xffffff);
  light_d1.position.set(1, 1, 1);
  sensorScene.add(light_d1);

  const light_d2 = new THREE.DirectionalLight(0x002288);
  light_d2.position.set(-1, -1, -1);
  sensorScene.add(light_d2);

  const light_a = new THREE.AmbientLight(0x222222);
  sensorScene.add(light_a);

  /*
   * ------------- LIGHTING ------------
   */

  window.addEventListener(
    "resize",
    function () {
      onWindowResize(sensorRenderer, sensorCamera, sensorScene);
    },
    false
  );
  sensorRender();
}

function objRender() {
  objRenderer.render(objScene, objCamera);
  requestAnimationFrame(objRender);
}

function sensorRender() {
  sensorRenderer.render(sensorScene, sensorCamera);
  requestAnimationFrame(sensorRender);
}
