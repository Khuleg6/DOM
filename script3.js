const digit = document.getElementById("digit");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

let elapsedMilliseconds = 0;
let startedAt = 0;
let timerId = null;

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const updateDisplay = () => {
  const currentElapsed = elapsedMilliseconds + (Date.now() - startedAt);
  digit.textContent = formatTime(currentElapsed);
};

startButton.addEventListener("click", () => {
  if (timerId !== null) return;

  startedAt = Date.now();
  timerId = setInterval(updateDisplay, 250);
  startButton.disabled = true;
  stopButton.disabled = false;
});

stopButton.addEventListener("click", () => {
  if (timerId === null) return;

  elapsedMilliseconds += Date.now() - startedAt;
  clearInterval(timerId);
  timerId = null;
  digit.textContent = formatTime(elapsedMilliseconds);
  startButton.disabled = false;
  stopButton.disabled = true;
});

resetButton.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  elapsedMilliseconds = 0;
  startedAt = 0;
  digit.textContent = "00:00:00";
  startButton.disabled = false;
  stopButton.disabled = true;
});
