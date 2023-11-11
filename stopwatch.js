let isRunning = false;
let startTime;
let lapStartTime;
let elapsedPausedTime = 0; // Track elapsed time when paused
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
  isRunning = true;
  startTime = Date.now() - elapsedPausedTime - (lapStartTime || 0);
  lapStartTime = Date.now();
  update();
  document.getElementById("startStopBtn").innerText = "Stop";
  resetBtn.innerText = "Reset";
  resetBtn.style.display = "block";
}

function stop() {
  isRunning = false;
  elapsedPausedTime += Date.now() - startTime;
  lapStartTime = null;
  document.getElementById("startStopBtn").innerText = "Resume";
  resetBtn.innerText = "Reset";
}

function lapReset() {
  if (isRunning) {
    // Record lap time
    const lapTime = Date.now() - lapStartTime;
    laps.push(formatTime(lapTime));

    // Update lap list
    updateLapList();

    // Update lap start time
    lapStartTime = Date.now();
  } else {
    // Reset the stopwatch
    startTime = null;
    lapStartTime = null;
    elapsedPausedTime = 0;
    laps = [];
    document.getElementById("output").innerText = formatTime(0);
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
  laps = [];
  lapList.textContent = "";
  startTime = null;
  lapStartTime = null;
  elapsedPausedTime = 0;
  if (isRunning) {
    stop();
  }
  resetBtn.style.display = "none";
}

resetBtn.addEventListener("click", reset);
