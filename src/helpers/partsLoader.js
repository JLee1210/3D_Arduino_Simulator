import * as THREE from "../../node_modules/three/build/three.module.js";
import globalVals from "../globalVars.js";
import { PLYLoader } from "../../node_modules/three/examples/jsm/loaders/PLYLoader.js";
import { resizeCameraControls } from "./resizeFuncs.js";

const { sensors, objects } = globalVals;
const plyLoader = new PLYLoader();

export function loadObject(
  objIndex,
  objName,
  objFiles,
  scene,
  camera,
  controls
) {
  objects[objIndex] = [];
  objFiles.forEach((part, index) => {
    const { name, color } = part;
    plyLoader.load("../ply/" + name + ".ply", (ply) => {
      ply.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        color: color, // white
        flatShading: true,
      });
      let obj = new THREE.Mesh(ply, material);
      obj.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.geometry.center();
        }
      });
      obj.visible = false;
      setPositions(obj, objName, index);
      obj.castShadow = true;
      obj.receiveShadow = true;
      objects[objIndex][index] = obj;
      scene.add(obj);
      if (index == objFiles.length - 1) {
        resizeCameraControls(obj, camera, controls);
      }
    });
  });
}

export function loadSensor(
  sensorIndex,
  sensorName,
  sensorFiles,
  scene,
  camera,
  controls
) {
  sensors[sensorIndex] = [];
  sensorFiles.forEach((part, index) => {
    const { name, color } = part;
    plyLoader.load("../ply/" + name + ".ply", (ply) => {
      ply.computeVertexNormals();
      const material = new THREE.MeshStandardMaterial({
        color: color, // white
        flatShading: true,
      });
      let sensor = new THREE.Mesh(ply, material);
      sensor.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.geometry.center();
        }
      });
      sensor.visible = false;
      setPositions(sensor, sensorName, index);
      sensor.castShadow = true;
      sensor.receiveShadow = true;
      sensors[sensorIndex][index] = sensor;
      scene.add(sensor);
      if (index == sensorFiles.length - 1) {
        resizeCameraControls(sensor, camera, controls);
      }
    });
  });
}

function setPositions(obj, objType, objIndice) {
  switch (objType) {
    case "servo":
      if (objIndice == 0) {
        obj.position.x = -5;
        obj.position.y = -(-15);
        obj.rotation.z = Math.PI;
      }
      break;
    case "motor":
      if (objIndice == 2) {
        obj.rotation.x = Math.PI;
        obj.scale.y = 0.5;
        obj.scale.z = 0.5;
        obj.scale.x = 0.5;
      }
      if (objIndice == 1) {
        obj.position.x = 10;
        obj.position.y = -3;
        obj.position.z = 10;
        obj.scale.y = 0.3;
        obj.scale.x = 0.3;
        obj.scale.z = 0.3;
      }
      if (objIndice == 0) {
        obj.position.x = -10;
        obj.position.y = -3;
        obj.position.z = 10;
        obj.rotation.z = Math.PI;
        obj.scale.y = 0.3;
        obj.scale.x = 0.3;
        obj.scale.z = 0.3;
      }
      break;
    case "sensor":
      break;
  }
}
