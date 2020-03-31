import * as THREE from "../node_modules/three/build/three.module.js";
import { PLYLoader } from "../node_modules/three/examples/jsm/loaders/PLYLoader.js";

const canvas = document.querySelector("#grid");

const fov = 80; // field of view
const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
const near = 1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas });

let horn;
let animate = true;

init();
animateCounterClockwise((90 * Math.PI) / 180);

function init() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(500, 300);
  //renderer.setSize(400, 300);

  camera.position.z = 50;

  scene.background = new THREE.Color(0xcccccc);
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
  // checkerboard base
  // {
  //   const planeSize = 40;

  //   const loader = new THREE.TextureLoader();
  //   const texture = loader.load(
  //     "https://threejsfundamentals.org/threejs/resources/images/checker.png"
  //   );
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.magFilter = THREE.NearestFilter;
  //   const repeats = planeSize / 2;
  //   texture.repeat.set(repeats, repeats);

  //   const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
  //   const planeMat = new THREE.MeshPhongMaterial({
  //     map: texture,
  //     side: THREE.DoubleSide
  //   });
  //   const mesh = new THREE.Mesh(planeGeo, planeMat);
  //   mesh.rotation.x = Math.PI * -0.5;
  //   scene.add(mesh);
  // }
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
  plyLoader.load("../ply/servo.ply", ply => {
    ply.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x0055ff,
      flatShading: true
    });
    const mesh = new THREE.Mesh(ply, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    // compute the box that contains all the stuff
    // from root and below
    // const box = new THREE.Box3().setFromObject(ply);

    // const boxSize = box.getSize(new THREE.Vector3()).length();
    // const boxCenter = box.getCenter(new THREE.Vector3());

    // // set the camera to frame the box
    // frameArea(boxSize * 2, boxSize, boxCenter, camera);
  });

  plyLoader.load("../ply/horn.ply", ply => {
    ply.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true
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
  //window.addEventListener("resize", onWindowResize, false);
}
// function resizeRendererToDisplaySize(renderer) {
//   const canvas = renderer.domElement;
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
//   const needResize = canvas.width !== width || canvas.height !== height;
//   if (needResize) {
//     renderer.setSize(width, height, false);
//   }
//   return needResize;
// }

// function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
//   const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
//   const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
//   const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

//   // compute a unit vector that points in the direction the camera is now
//   // from the center of the box
//   const direction = new THREE.Vector3()
//     .subVectors(camera.position, boxCenter)
//     .normalize();

//   // move the camera to a position distance units way from the center
//   // in whatever direction the camera was from the center already
//   camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

//   // pick some near and far values for the frustum that
//   // will contain the box.
//   camera.near = boxSize / 100;
//   camera.far = boxSize * 100;

//   camera.updateProjectionMatrix();

//   // point the camera to look at the center of the box
//   camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
// }

// function onWindowResize() {
//   let aspect = window.innerWidth / window.innerHeight;

//   camera.aspect = aspect;
//   camera.updateProjectionMatrix();

//   renderer.setSize(window.innerWidth, window.innerHeight);

//   controls.handleResize();
// }

function animateClockwise(targetRadian) {
  console.log(targetRadian);
  if (typeof horn !== "undefined") {
    if (horn.rotation.y >= -targetRadian) {
      renderClockwise();
    } else {
      animate = false;
    }
  }
  if (animate) {
    requestAnimationFrame(() => {
      animateClockwise(targetRadian);
    });
  }
}

function animateCounterClockwise(targetRadian) {
  if (typeof horn !== "undefined") {
    if (horn.rotation.y <= targetRadian) {
      renderCounterClockwise();
    } else {
      animate = false;
    }
  }
  if (animate) {
    requestAnimationFrame(() => {
      animateCounterClockwise(targetRadian);
    });
  }
}

function renderClockwise() {
  horn.rotation.y -= 0.01;
  renderer.render(scene, camera);
}

function renderCounterClockwise() {
  horn.rotation.y += 0.01;
  renderer.render(scene, camera);
}
