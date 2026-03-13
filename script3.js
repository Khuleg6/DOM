let secondsElapsed = 0;
const digit = document.getElementById("digit");
const button1 = document.getElementById("start");
const formatTime = (Time) => {
  const hours = Math.floor(Time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((Time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (Time % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const starTimer = () => {
  timerID = setInterval(() => {
    secondsElapsed++;
    digit.innerText = formatTime(secondsElapsed);
  }, 1000);
};

let timer = 0;

button1.addEventListener("click", () => {
  if (timer !== 0) return;

  timer = setInterval(() => {
    secondsElapsed++;
    digit.textContent = formatTime(secondsElapsed);
  }, 1000);
});
