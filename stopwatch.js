let isRunning = false;
let startTime;
let lapStartTime;
let elapsedPausedTime = 0;
let laps = [];
const lapList = document.getElementById("lapList");
const resetBtn = document.getElementById("reset");

function startStop() {
  if (isRunning) {
    stop();
  } else {
    start();
  }
}

function start() {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedPausedTime;
    lapStartTime = Date.now();
    update();
    document.getElementById("startStopBtn").innerText = "Stop";
    resetBtn.innerText = "Reset";
    resetBtn.style.display = "block";
  }
}

function stop() {
  if (isRunning) {
    isRunning = false;
    elapsedPausedTime = Date.now() - startTime;
    lapStartTime = null;
    document.getElementById("startStopBtn").innerText = "Resume";
    resetBtn.innerText = "Reset";
  }
}

function setLap() {
  if (isRunning) {
    // Update lap start time before recording lap time
    lapStartTime = Date.now();

    // Record lap time
    const lapTime = lapStartTime - startTime;
    laps.push(formatTime(lapTime));

    // Update lap list
    updateLapList();
  }
}

function update() {
  if (isRunning) {
    const elapsedTime = Date.now() - startTime;
    document.getElementById("output").innerText = formatTime(elapsedTime);
    requestAnimationFrame(update);
  }
}

function formatTime(time) {
  const date = new Date(time);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = Math.floor(date.getUTCMilliseconds() / 10)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateLapList() {
  lapList.innerHTML = "";
  laps.forEach((lap, index) => {
    const lapItem = document.createElement("li");
    lapItem.innerText = `Lap ${index + 1}: ${lap}`;
    lapList.appendChild(lapItem);
  });
}

function reset() {
  if (isRunning) {
    stop();
  }
  laps = [];
  lapList.textContent = "";
  startTime = null;
  lapStartTime = null;
  elapsedPausedTime = 0;
  document.getElementById("startStopBtn").innerText = "Start";
  document.getElementById("output").innerText = "00:00:00";
  resetBtn.style.display = "none";
}

resetBtn.addEventListener("click", reset);
