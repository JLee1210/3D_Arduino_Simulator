import * as THREE from "../node_modules/three/build/three.module.js";
import { PLYLoader } from "../node_modules/three/examples/jsm/loaders/PLYLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

const fov = 60; // field of view
const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
const near = 1;
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

const plyLoader = new PLYLoader();

// let horn;
// let servo;

const objects = new Array(9);
const animations = [];

// Add animation when generating a function
animations.push(false);
animations.push(false);

objMain();
loadObject();
sensorMain();

sensorCanvas.style.display = "none";
document.getElementById("anim1").onclick = function () {
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
  animations[0] = true;
  animations.forEach((val, index) => {
    if (index !== 0 && val != undefined) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  document.getElementById("play").onclick = function () {
    if (isReset) {
      animations[0] = true;
      objects[0][1].rotation.y = 0;
    }
    changePlayButton();
    animateClockwise((90 * Math.PI) / 180, 0, objects[0]);
  };
};

$("#sensors").on("show.bs.collapse", function () {
  sensorCanvas.style.display = "initial";
});

$("#sensors").on("hide.bs.collapse", function () {
  sensorCanvas.style.display = "none";
});

document.getElementById("anim2").onclick = function () {
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
  animations[1] = true;
  animations.forEach((val, index) => {
    if (index !== 1) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  document.getElementById("play").onclick = function () {
    changePlayButton();
    objects[1][1].rotation.y = 0;
    animateCounterClockwise((90 * Math.PI) / 180, 1);
  };
};

let isPlay = false;
let isReset = false;
function changePlayButton() {
  const playID = document.getElementById("play");
  if (!isPlay && !isReset) {
    playID.innerHTML = "Pause";
    isPlay = true;
  } else if (isPlay && !isReset) {
    playID.innerHTML = "Resume";
    isPlay = false;
  } else {
    playID.innerHTML = "Play";
    isReset = false;
    isPlay = false;
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
    onWindowResize(objRenderer, objCamera, objScene),
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
    onWindowResize(sensorRenderer, sensorCamera, sensorScene),
    false
  );
  sensorRender();
}

function loadObject() {
  objects[0] = [];
  objects[1] = [];
  plyLoader.load("../ply/servo.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      flatShading: true,
    });
    let servo = new THREE.Mesh(ply, material);
    servo.visible = false;
    servo.castShadow = true;
    servo.receiveShadow = true;
    objects[0].push(servo);
    //objects[1].push(servo);
    objScene.add(servo);
  });

  plyLoader.load("../ply/horn.ply", (ply) => {
    ply.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
    });
    let horn = new THREE.Mesh(ply, material);
    horn.visible = false;
    horn.position.x = -5;
    horn.position.y = -(-15);
    horn.rotation.z = Math.PI;
    //mesh.position.z = - 0.2;
    //mesh.scale.multiplyScalar( 0.01 );

    horn.castShadow = true;
    horn.receiveShadow = true;
    objects[0].push(horn);
    //objects[1].push(horn);
    objScene.add(horn);
  });
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function onWindowResize(renderer, camera, scene) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
}

//****************** ANIMATIONS *******************//

function animateClockwise(targetRadian, ftnIndex, object) {
  if (object[1].rotation.y >= -targetRadian) {
    object[1].rotation.y -= 0.01;
  } else {
    animations[ftnIndex] = false;
    isReset = true;
    document.getElementById("play").innerHTML = "Reset";
  }
  if (animations[ftnIndex] && isPlay) {
    requestAnimationFrame(() => {
      animateClockwise(targetRadian, ftnIndex, object);
    });
  }
}

function animateCounterClockwise(targetRadian, ftnIndex, object) {
  if (object[1].rotation.y <= targetRadian) {
    object[1].rotation.y += 0.01;
  } else {
    animations[ftnIndex] = false;
    isReset = true;
    document.getElementById("play").innerHTML = "Reset";
  }
  if (animations[ftnIndex] && isPlay) {
    requestAnimationFrame(() => {
      animateCounterClockwise(targetRadian, ftnIndex);
    });
  }
}

function objRender() {
  objRenderer.render(objScene, objCamera);
  requestAnimationFrame(objRender);
}

function sensorRender() {
  sensorRenderer.render(sensorScene, sensorCamera);
  requestAnimationFrame(sensorRender);
}
