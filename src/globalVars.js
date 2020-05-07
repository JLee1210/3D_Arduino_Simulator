/**
 * Global Variables
 * @param {String} animations array of booleans of current animation states
 * @param {Array} objects     array of three.js Geometry objects
 * @param {Array} sensors     array of three.js Geometry sensors
 * @param {float} timeStamp   last time after animation ends
 * @param {float} currTime    current time since first animation started
 * @param {Boolean} isPlay    boolean value to indicate if button is on play
 * @param {Boolean} isReset   boolean value to indicate if button is on reset
 */
export default {
  animations: [],
  objects: new Array(9),
  sensors: new Array(5),
  timeStamp: 1.0,
  currTime: 0.0,
  isPlay: false,
  isReset: false,
};
