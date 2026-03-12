const backspace = document.getElementById("backspace");
const input = document.getElementById("input");
const clear = document.getElementById("clear");
const percentage = document.getElementById("percentage");
const divide = document.getElementById("divide");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const nine = document.getElementById("nine");
const multiply = document.getElementById("multiply");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const minus = document.getElementById("minus");
const one = document.getElementById("one");
const two = document.getElementById("two");
const three = document.getElementById("three");
const plus = document.getElementById("plus");
const plusmulti = document.getElementById("plusmulti");
const zero = document.getElementById("zero");
const dot = document.getElementById("dot");
const equal = document.getElementById("equal");
seven.addEventListener("click", () => appendValue(""));
eight.addEventListener("click", () => appendValue(""));
nine.addEventListener("click", () => appendValue(""));
four.addEventListener("click", () => appendValue(""));
five.addEventListener("click", () => appendValue(""));
six.addEventListener("click", () => appendValue(""));
one.addEventListener("click", () => appendValue(""));
two.addEventListener("click", () => appendValue(""));
three.addEventListener("click", () => appendValue(""));
zero.addEventListener("click", () => appendValue(""));
plus.addEventListener("click", () => {
  addOperator("+");
  input.scrollLeft = input.scrollWidth;
});
plusmulti.addEventListener("click", () => {
  if (input.value !== "") {
    input.value = eval(input.value) * -1;
    input.scrollLeft = input.scrollWidth;
  }
});
minus.addEventListener("click", () => {
  addOperator("-");
  input.scrollLeft = input.scrollWidth;
});
multiply.addEventListener("click", () => {
  addOperator("*");
  input.scrollLeft = input.scrollWidth;
});
divide.addEventListener("click", () => {
  addOperator("/");
  input.scrollLeft = input.scrollWidth;
});

function appendValue(num) {
  if (input.value === "0") {
    input.value = num;
  } else {
    input.value += num;
  }
}
function addOperator(operator) {
  const lastChar = input.value.slice(-1);
  if (!["+", "-", "*", "/"].includes(lastChar)) {
    input.value += operator;
  }
}
function updateInput(value) {
  if (input.value === "0") {
    input.value = value;
  } else {
    input.value += value;
  }
  input.scrollLeft = input.scrollWidth;
}

seven.addEventListener("click", () => {
  {
    input.value += "7";
    input.scrollLeft = input.scrollWidth;
  }
});
eight.addEventListener("click", () => {
  {
    input.value += "8";
    input.scrollLeft = input.scrollWidth;
  }
});
nine.addEventListener("click", () => {
  {
    input.value += "9";
    input.scrollLeft = input.scrollWidth;
  }
});

four.addEventListener("click", () => {
  {
    input.value += "4";
    input.scrollLeft = input.scrollWidth;
  }
});
five.addEventListener("click", () => {
  {
    input.value += "5";
    input.scrollLeft = input.scrollWidth;
  }
});
six.addEventListener("click", () => {
  {
    input.value += "6";
    input.scrollLeft = input.scrollWidth;
  }
});
one.addEventListener("click", () => {
  input.value += "1";
  input.scrollLeft = input.scrollWidth;
});
two.addEventListener("click", () => {
  {
    input.value += "2";
    input.scrollLeft = input.scrollWidth;
  }
});
three.addEventListener("click", () => {
  input.value += "3";
  input.scrollLeft = input.scrollWidth;
});
zero.addEventListener("click", () => {
  input.value += "0";
  input.scrollLeft = input.scrollWidth;
});
dot.addEventListener("click", () => {
  const lastChar = input.value.slice(-1);
  if (lastChar !== ".") {
    input.value += ".";
    input.scrollLeft = input.scrollWidth;
  }
});
equal.addEventListener("click", () => {
  input.value = eval(input.value);
});

backspace.addEventListener("click", () => {
  if (input.value.length > 1) {
    input.value = input.value.slice(0, -1);
  } else {
    input.value = "";
  }
});
clear.addEventListener("click", () => {
  if (input.value.length > 0) {
    input.value = "";
  }
});
