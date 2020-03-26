import * as THREE from "../three.js/build/three.module.js";

function init() {
  const canvas = document.querySelector("#grid");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(400, 300);

  const fov = 75; // field of view
  const aspect = window.innerWidth / window.innerHeight; // display aspect (default: 300x150)
  const near = 0.1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  const boxWidth = 0.6;
  const boxHeight = 1;
  const boxDepth = 0.6;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light); // add lighting

  /**
   *
   * @param {THREE.BoxGeometry} geometry geometry of box
   * @param {int} color color of box via hex value
   * @param {int} x x position of box
   */

  const makeInstance = (geometry, color, x) => {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }; /* makeInstance() */

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0.5),
    makeInstance(geometry, 0x8844aa, -0.5)
  ];

  /**
   * Turns time into seconds and rotates the cube 360 turn every [time] seconds
   * @param {float} time time since page loaded in milliseconds
   */

  function render(time) {
    time *= 0.001; // convert time to seconds

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render); // tell browser to animate; re-render on change
  } /* render() */

  requestAnimationFrame(render);
}

init();
