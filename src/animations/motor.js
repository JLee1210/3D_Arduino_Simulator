import globalVals from "../globalVars.js";

/*
 * This file contains the animations for the motor component.
 * In these animations, currSec is always running via the built in requestAnimationFrame method.
 * Thus, we want to store that time whenever an animation ends so that we can use that value to
 * calculate the time needed for the next animation by taking the difference of currSec and timestamp.
 * We also store the currTime in a global variable every time requestAnimationFrame is called for future uses.
 */

const { animations, objects } = globalVals;

/**
 * animateForward()
 * * This function turns both wheels on the motor in a forward direction for maxSec duration.
 * @param {float} currSec this is the value of the current time in miliseconds
 * @param {float} maxSec  this is the value of the maximum time you want the animation to run
 * @param {integer} ftnIndex this is the index of the function/object to access in the objects array
 */

export function animateForward(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x -= 0.01;
    objects[ftnIndex][1].rotation.x -= 0.01;
  } else {
    // Once it reaches maximum seconds, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
    globalVals.timeStamp = currSec;
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateForward(time, maxSec, ftnIndex);
    });
  }
}

/**
 * animateBackward()
 * * This function turns both wheels on the motor in a backward direction for maxSec duration.
 * @param {float} currSec this is the value of the current time in miliseconds
 * @param {float} maxSec  this is the value of the maximum time you want the animation to run
 * @param {integer} ftnIndex this is the index of the function/object to access in the objects array
 */

export function animateBackward(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x += 0.01;
    objects[ftnIndex][1].rotation.x += 0.01;
  } else {
    // Once it reaches maximum seconds, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
    globalVals.timeStamp = currSec;
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateBackward(time, maxSec, ftnIndex);
    });
  }
}

/**
 * animateRight()
 * * This function turns the left wheel forward and the right wheel backward for maxSec duration.
 * @param {float} currSec this is the value of the current time in miliseconds
 * @param {float} maxSec  this is the value of the maximum time you want the animation to run
 * @param {integer} ftnIndex this is the index of the function/object to access in the objects array
 */

export function animateRight(currSec, maxSec, ftnIndex) {
  console.log(currSec, globalVals.timeStamp);
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x -= 0.01;
    objects[ftnIndex][1].rotation.x += 0.01;
  } else {
    // Once it reaches maximum seconds, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
    globalVals.timeStamp = currSec;
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateRight(time, maxSec, ftnIndex);
    });
  }
}

/**
 * animateLeft()
 * * This function turns the left wheel backward and the right wheel forward for maxSec duration.
 * @param {float} currSec this is the value of the current time in miliseconds
 * @param {float} maxSec  this is the value of the maximum time you want the animation to run
 * @param {integer} ftnIndex this is the index of the function/object to access in the objects array
 */

export function animateLeft(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x += 0.01;
    objects[ftnIndex][1].rotation.x -= 0.01;
  } else {
    // Once it reaches maximum seconds, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
    globalVals.timeStamp = currSec;
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateLeft(time, maxSec, ftnIndex);
    });
  }
}
