const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("total-balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateBalance() {
  const balance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  balanceDisplay.innerText = balance.toFixed(2);
}

function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((tx, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${tx.date} - <strong>${tx.description}</strong> - ₹${tx.amount} [${tx.category}] 
      <button onclick="deleteTransaction(${index})">❌</button>`;
    transactionList.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateLocalStorage();
  updateUI();
}

function updateUI() {
  renderTransactions();
  updateBalance();
  renderChart();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const desc = document.getElementById("description").value;
  const amt = +document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const cat = document.getElementById("category").value;

  const transaction = {
    description: desc,
    amount: amt,
    date: date,
    category: cat,
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();
  form.reset();
});

function renderChart() {
  const ctx = document.getElementById("expense-chart").getContext("2d");
  const expenseCategories = {};

  transactions.forEach((tx) => {
    if (tx.amount < 0) {
      expenseCategories[tx.category] = (expenseCategories[tx.category] || 0) + Math.abs(tx.amount);
    }
  });

  if (window.pieChart) window.pieChart.destroy();

  window.pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(expenseCategories),
      datasets: [{
        label: "Expenses",
        data: Object.values(expenseCategories),
        backgroundColor: ["#f44336", "#2196f3", "#ff9800", "#4caf50"],
      }]
    },
  });
}

updateUI();
