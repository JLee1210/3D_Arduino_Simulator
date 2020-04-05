import * as THREE from "../node_modules/three/build/three.module.js";
import { PLYLoader } from "../node_modules/three/examples/jsm/loaders/PLYLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("#grid");

const fov = 60; // field of view
const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
const near = 1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const controls = new OrbitControls(camera, canvas);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas });

let horn;
const animations = [];
animations.push(false);
animations.push(false);

init();
document.getElementById("anim1").onclick = function () {
  document.getElementById("anim" + (1).toString()).disabled = true;
  animations[0] = true;
  animations.forEach((val, index) => {
    if (index !== 0) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  horn.rotation.y = 0;
  animateClockwise((90 * Math.PI) / 180, 0);
};

document.getElementById("anim2").onclick = function () {
  document.getElementById("anim" + (2).toString()).disabled = true;
  animations[1] = true;
  animations.forEach((val, index) => {
    if (index !== 1) {
      animations[index] = false;
      document.getElementById("anim" + (index + 1).toString()).disabled = false;
    }
  });
  horn.rotation.y = 0;
  animateCounterClockwise((90 * Math.PI) / 180, 1);
};

function init() {
  camera.position.z = 50;
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  controls.target.set(0, 5, 0);
  controls.update();

  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

  /*
   * ------------- LIGHTING -----------------
   */
  // {
  //   const skyColor = 0xb1e1ff; // light blue
  //   const groundColor = 0xb97a20; // brownish orange
  //   const intensity = 1;
  //   const hlight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  //   scene.add(hlight);
  // }

  // {
  //   const color = 0xffffff;
  //   const intensity = 1;
  //   const dlight = new THREE.DirectionalLight(color, intensity);
  //   dlight.position.set(0, 10, 0);
  //   dlight.target.position.set(-5, 0, 0);
  //   scene.add(dlight);
  //   scene.add(dlight.target);
  // }
  /*
   * ------------- LIGHTING -----------------
   */

  const plyLoader = new PLYLoader();
  plyLoader.load("../ply/servo.ply", (ply) => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(ply, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  plyLoader.load("../ply/horn.ply", (ply) => {
    ply.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
    });
    horn = new THREE.Mesh(ply, material);

    horn.position.x = -5;
    horn.position.y = -(-15);
    horn.rotation.z = Math.PI;
    //mesh.position.z = - 0.2;
    //mesh.scale.multiplyScalar( 0.01 );

    horn.castShadow = true;
    horn.receiveShadow = true;

    scene.add(horn);
  });

  /*
   * ------------- LIGHTING ------------
   */
  const light_d1 = new THREE.DirectionalLight(0xffffff);
  light_d1.position.set(1, 1, 1);
  scene.add(light_d1);

  const light_d2 = new THREE.DirectionalLight(0x002288);
  light_d2.position.set(-1, -1, -1);
  scene.add(light_d2);

  const light_a = new THREE.AmbientLight(0x222222);
  scene.add(light_a);
  /*
   * ------------- LIGHTING ------------
   */
  window.addEventListener("resize", onWindowResize, false);
  //animateCounterClockwise((90 * Math.PI) / 180);
  render();
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

function onWindowResize() {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
}

function animateClockwise(targetRadian, ftnIndex) {
  if (horn.rotation.y >= -targetRadian) {
    horn.rotation.y -= 0.01;
  } else {
    animations[ftnIndex] = false;
    document.getElementById(
      "anim" + (ftnIndex + 1).toString()
    ).disabled = false;
  }
  if (animations[ftnIndex]) {
    requestAnimationFrame(() => {
      animateClockwise(targetRadian, ftnIndex);
    });
  }
}

function animateCounterClockwise(targetRadian, ftnIndex) {
  if (horn.rotation.y <= targetRadian) {
    horn.rotation.y += 0.01;
  } else {
    animations[ftnIndex] = false;
    document.getElementById(
      "anim" + (ftnIndex + 1).toString()
    ).disabled = false;
  }
  if (animations[ftnIndex]) {
    requestAnimationFrame(() => {
      animateCounterClockwise(targetRadian, ftnIndex);
    });
  }
}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
