import * as THREE from "../../node_modules/three/build/three.module.js";

const boundingBox = new THREE.Box3();
const offset = 10 || 1.25;

export function resizeCameraControls(obj, objCamera, objControls) {
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

export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = canvas.clientHeight * pixelRatio;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export function onWindowResize(renderer, camera, scene) {
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  renderer.render(scene, camera);
}
