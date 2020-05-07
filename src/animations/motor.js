import globalVals from "../globalVars.js";

const { animations, objects } = globalVals;

export function animateForward(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x -= 0.01;
    objects[ftnIndex][1].rotation.x -= 0.01;
  } else {
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

export function animateBackward(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x += 0.01;
    objects[ftnIndex][1].rotation.x += 0.01;
  } else {
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

export function animateRight(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x -= 0.01;
    objects[ftnIndex][1].rotation.x += 0.01;
  } else {
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

export function animateLeft(currSec, maxSec, ftnIndex) {
  let progress = currSec - globalVals.timeStamp;
  progress *= 0.001; // convert time to seconds
  if (progress < maxSec) {
    objects[ftnIndex][0].rotation.x += 0.01;
    objects[ftnIndex][1].rotation.x -= 0.01;
  } else {
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
