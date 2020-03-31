import * as THREE from "../node_modules/three/build/three.module.js";
import { OBJLoader2 } from "../node_modules/three/examples/jsm/loaders/OBJLoader2.js";

function init() {
  const canvas = document.querySelector("#grid");
  const renderer = new THREE.WebGLRenderer({ canvas });
  //renderer.setSize(400, 300);

  const fov = 75; // field of view
  const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 100);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  const boxWidth = 0.6;
  const boxHeight = 1;
  const boxDepth = 0.6;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
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
  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const hlight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(hlight);
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const dlight = new THREE.DirectionalLight(color, intensity);
    dlight.position.set(0, 10, 0);
    dlight.target.position.set(-5, 0, 0);
    scene.add(dlight);
    scene.add(dlight.target);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);

    // compute a unit vector that points in the direction the camera is now
    // from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }
  let sice;
  const objLoader = new OBJLoader2();
  objLoader.load("objs/wheel.obj", root => {
    sice = root;
    console.log(sice);
    scene.add(sice);
    // compute the box that contains all the stuff
    // from root and below
    const box = new THREE.Box3().setFromObject(sice);

    const boxSize = box.getSize(new THREE.Vector3()).length();
    const boxCenter = box.getCenter(new THREE.Vector3());

    // set the camera to frame the box
    frameArea(boxSize * 2, boxSize, boxCenter, camera);
  });

  /**
   * makeCube
   * @param {THREE.BoxGeometry} geometry geometry of box
   * @param {int} color color of box via hex value
   * @param {int} x x position of box
   */

  // const makeInstance = (geometry, color, x) => {
  //   const material = new THREE.MeshPhongMaterial({ color });

  //   const cube = new THREE.Mesh(geometry, material);
  //   scene.add(cube);

  //   cube.position.x = x;

  //   return cube;
  // }; /* makeInstance() */

  // const cubes = [
  //   makeInstance(geometry, 0x44aa88, 0.5),
  //   makeInstance(geometry, 0x8844aa, -0.5)
  // ];

  /**
   * rotateCube
   * Turns time into seconds and rotates the cube 360 turn every [time] seconds
   * @param {float} time time since page loaded in milliseconds
   */

  // function render(time) {
  //   time *= 0.001; // convert time to seconds

  //   cubes.forEach((cube, ndx) => {
  //     const speed = 1 + ndx * 0.1;
  //     const rot = time * speed;
  //     cube.rotation.x = rot;
  //     cube.rotation.y = rot;
  //   });

  //   renderer.render(scene, camera);

  //   requestAnimationFrame(render); // tell browser to animate; re-render on change
  // } /* render() */
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    if (typeof sice !== "undefined") {
      console.log(sice.position.x == 15);
      if (sice.position.y >= 2) {
        const pos_y = sice.position.y;
        sice.position.set(0, -pos_y, 0);
      }
      sice.translateY(0.005);
      //camera.translateY(-0.01);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

init();
