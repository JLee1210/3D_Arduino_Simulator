import globalVals from "../globalVars.js";

/*
 * This file contains the animations for the servo component.
 * In these animations, currSec is always running via the built in requestAnimationFrame method.
 * Thus, we want to store that time whenever an animation ends so that we can use that value to
 * calculate the time needed for the next animation by taking the difference of currSec and timestamp.
 * We also store the currTime in a global variable every time requestAnimationFrame is called for future uses.
 */

const { animations, objects } = globalVals;

/**
 * animateClockwise()
 * * This function moves the servo horn in a clockwise direction up to the targetRadian.
 * @param {float} targetRadian value of desired angle in radians using Math.PI
 * @param {integer} ftnIndex index of function/object to access in the objects array
 */

export function animateClockwise(targetRadian, ftnIndex) {
  if (objects[ftnIndex][0].rotation.y >= -targetRadian) {
    objects[ftnIndex][0].rotation.y -= 0.01;
  } else {
    // Once it reaches targetRadian, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateClockwise(targetRadian, ftnIndex);
    });
  }
}

/**
 * animateCounterClockwise()
 * * This function moves the servo horn in a counterclockwise direction up to the targetRadian.
 * @param {float} targetRadian value of desired angle in radians using Math.PI
 * @param {integer} ftnIndex index of function/object to access in the objects array
 */

export function animateCounterClockwise(targetRadian, ftnIndex, objects) {
  if (objects[ftnIndex][0].rotation.y <= targetRadian) {
    objects[ftnIndex][0].rotation.y += 0.01;
  } else {
    // Once it reaches targetRadian, stop the animation and enable the reset button
    animations[ftnIndex] = false;
    globalVals.isReset = true;
    document.getElementById("play").innerHTML = "Reset";
  }
  if (animations[ftnIndex] && globalVals.isPlay) {
    requestAnimationFrame((time) => {
      globalVals.currTime = time;
      animateCounterClockwise(targetRadian, ftnIndex);
    });
  }
}
