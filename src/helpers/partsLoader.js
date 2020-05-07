import * as THREE from "../../node_modules/three/build/three.module.js";
import globalVals from "../globalVars.js";
import { PLYLoader } from "../../node_modules/three/examples/jsm/loaders/PLYLoader.js";
import { resizeCameraControls } from "./resizeFuncs.js";

/*
 * This file contains all the necessary functions to load a ply object.
 */

const { sensors, objects } = globalVals;
const plyLoader = new PLYLoader();

/**
 * loadObject()
 * * This function takes objFiles and loads them using a plyLoader. Then
 * * it stores the objects respectively in the objects array associated with
 * * the objIndex. objName is used to distinguish the positioning of the object
 * * via setPositions() method.
 * @param {integer} objIndex index of object to access in the objects array
 * @param {String} objName  name of object we want to load
 * @param {Array} objFiles array of names of the ply file we want to load
 * @param {THREE.Scene} scene    the three.js Scene
 * @param {THREE.PerspectiveCamera} camera   the three.js PerspectiveCamera
 * @param {THREE.OrbitControls} controls the three.js OrbitControls
 */

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

/**
 * loadObject()
 * * This function takes sensorFiles and loads them using a plyLoader. Then
 * * it stores the sensors respectively in the sensors array associated with
 * * the sensorIndex. sensorName is used to distinguish the positioning of the sensor
 * * via setPositions() method.
 * @param {integer} sensorIndex index of sensor to access in the sensors array
 * @param {String} sensorName  name of sensor we want to load
 * @param {Array} sensorFiles array of names of the ply file we want to load
 * @param {THREE.Scene} scene    the three.js Scene
 * @param {THREE.PerspectiveCamera} camera   the three.js PerspectiveCamera
 * @param {THREE.OrbitControls} controls the three.js OrbitControls
 */

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

/**
 * setPositions()
 * * This function takes in an obj and updates the positions based on the
 * * objType value. The objIndice is used to update specific parts if the array
 * * length of the objects/sensors is greater than 1.
 * @param {THREE.Geometry} obj the object we want to update the positions
 * @param {String} objType the type of the object
 * @param {integer} objIndice
 */

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
