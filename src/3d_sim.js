import * as THREE from "../node_modules/three/build/three.module.js";
import { PLYLoader } from "../node_modules/three/examples/jsm/loaders/PLYLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

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
  animations[0] = true;
  animations.forEach((val, index) => {
    if (index !== 0 && val != undefined) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  document.getElementById("play").onclick = function () {
    console.log(objects[0]);
    if (isReset) {
      animations[0] = true;
      objects[0][0].rotation.y = 0;
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
  //resetAnimation(1, "servo");
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
  animations[1] = true;
  animations.forEach((val, index) => {
    if (index !== 1) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  document.getElementById("play").onclick = function () {
    if (isReset) {
      animations[1] = true;
      objects[1][0].rotation.y = 0;
    }
    changePlayButton();
    animateCounterClockwise((90 * Math.PI) / 180, 0, objects[1]);
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

function resetAnimation(objIndex, animation) {
  isPlay = false;
  isReset = true;
  switch (animation) {
    case "servo":
      objects[objIndex][0].rotation.y = 0;
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
  plyLoader.load("../ply/horn.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff, // white
      flatShading: true,
    });
    let horn = new THREE.Mesh(ply, material);
    horn.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.center();
      }
    });
    horn.visible = false;
    horn.position.x = -5;
    horn.position.y = -(-15);
    horn.rotation.z = Math.PI;

    horn.castShadow = true;
    horn.receiveShadow = true;
    objects[0][0] = horn;
    //objects[1].push(horn);
    objScene.add(horn);
  });

  plyLoader.load("../ply/servo.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      flatShading: true,
    });
    let servo = new THREE.Mesh(ply, material);
    servo.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.center();
      }
    });
    servo.visible = false;
    servo.castShadow = true;
    servo.receiveShadow = true;
    objects[0][1] = servo;
    //objects[1].push(servo);
    objScene.add(servo);
    resizeCameraControls(servo);
  });

  plyLoader.load("../ply/Wheel.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x696969, // white
      flatShading: true,
    });
    let wheel = new THREE.Mesh(ply, material);
    wheel.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.center();
      }
    });
    wheel.visible = true;
    wheel.position.x = -10;
    wheel.position.y = -3;
    wheel.position.z = 10;
    wheel.rotation.z = Math.PI;
    wheel.scale.y = 0.3;
    wheel.scale.x = 0.3;
    wheel.scale.z = 0.3;

    wheel.castShadow = true;
    wheel.receiveShadow = true;
    objects[1][0] = wheel;
    objScene.add(wheel);
    //resizeCameraControls(wheel);
  });

  plyLoader.load("../ply/Wheel.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x696969, // white
      flatShading: true,
    });
    let wheel = new THREE.Mesh(ply, material);
    wheel.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.center();
      }
    });
    wheel.visible = true;
    wheel.position.x = 10;
    wheel.position.y = -3;
    wheel.position.z = 10;
    wheel.rotation.z = 0;
    wheel.scale.y = 0.3;
    wheel.scale.x = 0.3;
    wheel.scale.z = 0.3;

    wheel.castShadow = true;
    wheel.receiveShadow = true;
    objects[1][1] = wheel;
    objScene.add(wheel);
    //resizeCameraControls(wheel);
  });
  plyLoader.load("../ply/DC_motor_2.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff, // blue
      flatShading: true,
    });

    let motor = new THREE.Mesh(ply, material);
    motor.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.geometry.center();
      }
    });
    motor.visible = true;
    motor.position.x = 0;
    motor.position.y = 0;
    motor.position.z = 0;
    motor.scale.y = 0.5;
    motor.scale.z = 0.5;
    motor.scale.x = 0.5;

    motor.rotation.x = Math.PI;
    //motor.rotation.z = Math.PI;

    motor.castShadow = true;
    motor.receiveShadow = true;
    objects[1][2] = motor;
    objScene.add(motor);
    resizeCameraControls(motor);
  });
}

const boundingBox = new THREE.Box3();
const offset = 10 || 1.25;

function resizeCameraControls(obj) {
  boundingBox.setFromObject(obj);
  const center = boundingBox.getCenter();
  const size = boundingBox.getSize();
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = objCamera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 3.5) * Math.tan(fov * 2));
  cameraZ *= offset;
  const minZ = boundingBox.min.z;
  const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
  objCamera.position.z = center.z + cameraZ;

  objCamera.lookAt(center);
  objControls.target = center;

  // prevent camera from zooming out far enough to create far plane cutoff
  objControls.maxDistance = cameraToFarEdge * 4;
  objControls.saveState();
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
  if (object[0].rotation.y >= -targetRadian) {
    object[0].rotation.y -= 0.01;
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
  if (object[0].rotation.y <= targetRadian) {
    object[0].rotation.y += 0.01;
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
