const lapList = document.getElementById("lapList");
const resetBtn = document.getElementById("reset");

// Load data from local storage on page load
const storedData = JSON.parse(localStorage.getItem("stopwatchData")) || {};
let isRunning = storedData.isRunning || false,
startTime = storedData.startTime || null,
lapStartTime = storedData.lapStartTime || null,
elapsedPausedTime = storedData.elapsedPausedTime || 0,
laps = storedData.laps || [];

function startStop() {
  if (isRunning) {
    stop();
  } else {
    start();
  }
}

function start() {
  addBeforeUnloadWarning()
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now() - elapsedPausedTime;
    lapStartTime = Date.now();
    update();
    document.getElementById("startStopBtn").innerText = "Stop";
    resetBtn.innerText = "Reset";
    resetBtn.style.display = "block";
    saveDataToLocalStorage();
  }
}

function stop() {
  removeBeforeUnloadWarning()
  if (isRunning) {
    isRunning = false;
    elapsedPausedTime = Date.now() - startTime;
    lapStartTime = null;
    document.getElementById("startStopBtn").innerText = "Resume";
    resetBtn.innerText = "Reset";
    saveDataToLocalStorage();
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
    saveDataToLocalStorage();
  }
}

function update() {
  if (isRunning) {
    const elapsedTime = Date.now() - startTime;
    document.getElementById("output").innerText = formatTime(elapsedTime);
    requestAnimationFrame(update);
    saveDataToLocalStorage();
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
  removeBeforeUnloadWarning()
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

  // Clear data from local storage
  localStorage.removeItem("stopwatchData");
}

resetBtn.addEventListener("click", reset);

function saveDataToLocalStorage() {
  // Save relevant data to local storage
  const dataToSave = {
    isRunning,
    startTime,
    lapStartTime,
    elapsedPausedTime,
    laps,
  };
  localStorage.setItem("stopwatchData", JSON.stringify(dataToSave));
}

function loadDataFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("stopwatchData")) || {};

  if (storedData.startTime) {
    elapsedPausedTime = storedData.elapsedPausedTime || 0;
    startTime = Date.now() - elapsedPausedTime;
    isRunning = storedData.isRunning || false;
    lapStartTime = storedData.lapStartTime || null;
    laps = storedData.laps || [];

    if (isRunning) {
      start();
    } else {
      const elapsedTime = Date.now() - startTime;
      document.getElementById("output").innerText = formatTime(elapsedTime);
      document.getElementById("startStopBtn").innerText = "Resume";
      resetBtn.innerText = "Reset";
      resetBtn.style.display = "block";
    }

    // Display previous laps
    updateLapList();
  }
}

window.addEventListener("load", loadDataFromLocalStorage);

function addBeforeUnloadWarning() {
  // Add the beforeunload event listener
  window.addEventListener("beforeunload", beforeUnloadHandler);
}

function removeBeforeUnloadWarning() {
  // Remove the beforeunload event listener
  window.removeEventListener("beforeunload", beforeUnloadHandler);
}

function beforeUnloadHandler(e) {
  e.preventDefault();
  e.returnValue =
    "You have unsaved changes. Are you sure you want to leave this page?";
}