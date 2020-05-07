import globalVals from "../globalVars.js";

const { animations, objects } = globalVals;

export function animateClockwise(targetRadian, ftnIndex) {
  if (objects[ftnIndex][0].rotation.y >= -targetRadian) {
    objects[ftnIndex][0].rotation.y -= 0.01;
  } else {
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

export function animateCounterClockwise(targetRadian, ftnIndex, objects) {
  if (objects[ftnIndex][0].rotation.y <= targetRadian) {
    objects[ftnIndex][0].rotation.y += 0.01;
  } else {
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
