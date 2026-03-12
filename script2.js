const tips = document.getElementById("tips");
const BillInput = document.getElementById("bill-Input");
const total = document.getElementById("total");
const reset = document.getElementById("reset");
const sanitizeBillInput = (input) => {
  // Зөвхөн number авна.
  input = input.replace(/[^\d.]/g, "");

  // Зөвхөн 1 бутархайн (.) авна.
  if ((input.match(/\./g) || []).length > 1) {
    input = input.slice(0, -1);
  }

  return input;
};
BillInput.addEventListener("input", () => {
  BillInput.value = sanitizeBillInput(BillInput.value);
});
const calculate = (percentage) => {
  const bill = parseFloat(BillInput.value) || 0;
  const tipAmount = bill * (percentage / 100);
  const finalTotal = bill + tipAmount;

  total.innerText = finalTotal.toFixed(2);
};
tips.addEventListener("click", (event) => {
  if (event.target.tagName != "BUTTON") {
    return;
  }
  const percentValue = parseFloat(event.target.textContent);
  calculate(percentValue);
});
reset.addEventListener("click", () => {
  total.innerText = "0.00";
  BillInput.value = "";
});
