const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const submitBtn = document.getElementById("submitBtn");

const buyPremiumCard = document.getElementById("buyPremiumCard");
const premiumCard = document.getElementById("premiumCard");

const leaderboardSection = document.getElementById("leaderboardSection");
const leaderboardList = document.getElementById("leaderboardList");

const reportSection = document.getElementById("reportSection");
const reportFilter = document.getElementById("reportFilter");
const reportExpense = document.getElementById("reportExpense");
const reportTransactions = document.getElementById("reportTransactions");
const reportAverage = document.getElementById("reportAverage");
const reportTableBody = document.getElementById("reportTableBody");
const downloadReportBtn = document.getElementById("downloadReportBtn");
const logoutBtn = document.getElementById("logoutBtn");
const pagination = document.getElementById("pagination");
const itemsPerPage = document.getElementById("itemsPerPage");
// const reportFilter = document.getElementById("reportFilter");
const dynamicFilter = document.getElementById("dynamicFilter");
// const BASE_URL = "http://13.201.130.108:3000/users";

let editExpenseId = null;
let allExpenses = [];
let filteredReportExpenses = [];
let leaderboardLoaded = false;
let isPremiumUser = false;
let currentPage = 1;
let ITEMS_PER_PAGE = Number(localStorage.getItem("itemsPerPage")) || 10;

itemsPerPage.addEventListener("change", () => {
  ITEMS_PER_PAGE = Number(itemsPerPage.value);
  localStorage.setItem("itemsPerPage", ITEMS_PER_PAGE);
  loadExpenses(currentPage);
});

const token = localStorage.getItem("token");

// if (!token) {
//   window.location.href = "login.html";
// }

window.addEventListener("DOMContentLoaded", async () => {
  try {
    // const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("login.html");
      return;
    }
    itemsPerPage.value = ITEMS_PER_PAGE;
    await loadExpenses();
    await checkPremiumStatus();
  } catch (err) {
    console.log(err);
  }
});

form.addEventListener("submit", addExpense);
reportFilter.addEventListener("change", renderFilterInputs);

renderFilterInputs();

// reportFilter.addEventListener("change", updateReport);
document
.getElementById("applyFilterBtn")
.addEventListener("click", updateReport);
downloadReportBtn.addEventListener("click", downloadReport);


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

async function loadExpenses(page) {
  try {
    currentPage = page || 1;
    const res = await axios.get(
      `${BASE_URL}/expenses?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    allExpenses = res.data.expenses;
    expenseList.innerHTML = "";

    allExpenses.forEach((exp) => {
      displayExpense(exp);
    });

    showPagination(res.data);
    if (isPremiumUser) {
      updateReport();
    }
  } catch (err) {
    console.log(err);
  }
}

function showPagination(data) {
  console.log(data);
  pagination.innerHTML = "";

  if (data.hasPreviousPage) {
    let prevBtn = document.createElement("button");
    prevBtn.className = "btn btn-secondary mx-1";
    prevBtn.innerText = "Previous";
    // prevBtn.onclick = () => loadExpenses(data.hasPreviousPage);
    prevBtn.onclick = () => loadExpenses(data.previousPage);
    pagination.appendChild(prevBtn);
  }

  let currentBtn = document.createElement("button");
  currentBtn.innerText = data.currentPage;
  currentBtn.classList.add("active");

  pagination.appendChild(currentBtn);

  if (data.hasNextPage) {
    let nextBtn = document.createElement("button");
    nextBtn.className = "btn btn-secondary mx-1";
    nextBtn.innerText = "Next";
    // nextBtn.onclick = () => loadExpenses(data.hasNextPage);
    nextBtn.onclick = () => loadExpenses(data.nextPage);
    pagination.appendChild(nextBtn);
  }
}

async function addExpense(e) {
  e.preventDefault();

  const expense = {
    amount: amount.value,
    description: description.value,
    // category: category.value,
    note: note.value,
  };

  try {
    if (editExpenseId) {
      await axios.put(`${BASE_URL}/expenses/${editExpenseId}`, expense, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      submitBtn.innerHTML = "Add Expense";
      editExpenseId = null;
    } else {
      await axios.post(`${BASE_URL}/expenses`, expense, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    form.reset();
    // await loadExpenses();
    await loadExpenses(currentPage);
  } catch (err) {
    console.log(err);
  }
}

function showPremiumUI() {
  buyPremiumCard.style.display = "none";
  premiumCard.style.display = "block";
  reportSection.style.display = "block";
  leaderboardSection.style.display = "block";
  showLeaderboard();
  updateReport();
}

function showNormalUI() {
  buyPremiumCard.style.display = "block";
  premiumCard.style.display = "none";
  reportSection.style.display = "none";
  leaderboardSection.style.display = "none";
}

async function checkPremiumStatus() {
  try {
    const res = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    isPremiumUser = res.data.isPremium;

    if (isPremiumUser) {
      showPremiumUI();
    } else {
      showNormalUI();
    }
  } catch (err) {
    console.log(err);
  }
}

async function showLeaderboard() {
  if (leaderboardLoaded) return;

  try {
    const { data } = await axios.get(`${BASE_URL}/purchase/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    leaderboardList.innerHTML = "";

    const medals = ["🥇", "🥈", "🥉"];

    data.forEach((user, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between";
      li.innerHTML = `
        <span>
          ${medals[index] || `${index + 1}.`}
          <strong>${user.name}</strong>
        </span>
        <span>₹${user.totalExpense}</span>
      `;
      leaderboardList.appendChild(li);
    });

    leaderboardLoaded = true;
  } catch (err) {
    console.log("Leaderboard Error:", err);
  }
}





function renderFilterInputs() {

    const filter = reportFilter.value;

    dynamicFilter.innerHTML = "";

    if (filter === "Daily") {

        dynamicFilter.innerHTML = `
            <label>Select Date</label>
            <input type="date" id="selectedDate" class="form-control">
        `;
    }

    else if (filter === "Weekly") {

        dynamicFilter.innerHTML = `
            <label>Start Date</label>
            <input type="date" id="startDate" class="form-control mb-2">

            <label>End Date</label>
            <input type="date" id="endDate" class="form-control">
        `;
    }

    else if (filter === "Monthly") {

        dynamicFilter.innerHTML = `
            <label>Month</label>

            <select id="selectedMonth" class="form-select mb-2">

                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>

            </select>

            <label>Year</label>

            <input
                type="number"
                id="selectedYear"
                value="${new Date().getFullYear()}"
                class="form-control"
            >
        `;
    }

    else if (filter === "Yearly") {

        dynamicFilter.innerHTML = `
            <label>Year</label>

            <input
                type="number"
                id="selectedYear"
                value="${new Date().getFullYear()}"
                class="form-control"
            >
        `;
    }

}

function filterExpensesByPeriod(expenses, filter) {

    return expenses.filter((expense) => {

        const expenseDate = new Date(expense.createdAt);

        if (filter === "Daily") {

            const selected = new Date(
                document.getElementById("selectedDate").value
            );

            return expenseDate.toDateString() === selected.toDateString();
        }

        if (filter === "Weekly") {

            const start = new Date(
                document.getElementById("startDate").value
            );

            const end = new Date(
                document.getElementById("endDate").value
            );

            end.setHours(23,59,59,999);

            return expenseDate >= start && expenseDate <= end;
        }

        if (filter === "Monthly") {

            const month = Number(
                document.getElementById("selectedMonth").value
            );

            const year = Number(
                document.getElementById("selectedYear").value
            );

            return expenseDate.getMonth() === month &&
                   expenseDate.getFullYear() === year;
        }

        if (filter === "Yearly") {

            const year = Number(
                document.getElementById("selectedYear").value
            );

            return expenseDate.getFullYear() === year;
        }

        return true;

    });

}

// function filterExpensesByPeriod(expenses, filter) {
//   const now = new Date();

//   return expenses.filter((expense) => {
//     const expenseDate = new Date(expense.createdAt);

//     if (filter === "Daily") {
//       return expenseDate.toDateString() === now.toDateString();
//     }

//     if (filter === "Weekly") {
//       const weekAgo = new Date(now);
//       weekAgo.setDate(now.getDate() - 7);
//       return expenseDate >= weekAgo && expenseDate <= now;
//     }

//     return (
//       expenseDate.getMonth() === now.getMonth() &&
//       expenseDate.getFullYear() === now.getFullYear()
//     );
//   });
// }

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function updateReport() {
  const filter = reportFilter.value;
  filteredReportExpenses = filterExpensesByPeriod(allExpenses, filter);

  const total = filteredReportExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0,
  );
  const count = filteredReportExpenses.length;
  const average = count ? total / count : 0;

  reportExpense.textContent = `₹${total.toFixed(2)}`;
  reportTransactions.textContent = count;
  reportAverage.textContent = `₹${average.toFixed(2)}`;

  reportTableBody.innerHTML = "";

  if (!count) {
    reportTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          No expenses found for this period
        </td>
      </tr>
    `;
    return;
  }

  filteredReportExpenses.forEach((expense) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(expense.createdAt)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td><strong>₹${expense.amount}</strong></td>
    `;
    reportTableBody.appendChild(row);
  });
}

// function downloadReport() {
//   if (!filteredReportExpenses.length) {
//     alert("No expenses to download for the selected period.");
//     return;
//   }

//   const filter = reportFilter.value;
//   const headers = ["Date", "Description", "Category", "Amount"];
//   const rows = filteredReportExpenses.map((expense) => [
//     formatDate(expense.createdAt),
//     expense.description,
//     expense.category,
//     expense.amount,
//   ]);

//   const csvContent = [headers, ...rows]
//     .map((row) => row.map((cell) => `"${cell}"`).join(","))
//     .join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = `expense-report-${filter.toLowerCase()}.csv`;
//   link.click();
//   URL.revokeObjectURL(link.href);
// }

async function downloadReport() {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BASE_URL}/download`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // window.open(res.data.fileURL);
    window.open(res.data.fileURL, "_blank");
  } catch (err) {
    console.log(err);

    alert("Download failed");
  }
}

function displayExpense(expense) {
  const li = document.createElement("li");
  li.className = "list-group-item";

  li.innerHTML = `
    <div>
      <strong>₹${expense.amount}</strong>
      <br>
      ${expense.description}
      <br>
      <small>${expense.category}</small>
       <small>${expense.note}</small>
      ${
        expense.createdAt
          ? `<br><small class="text-muted">${formatDate(expense.createdAt)}</small>`
          : ""
      }
    </div>
  `;

  const btnDiv = document.createElement("div");
  btnDiv.className = "actionBtns";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-warning btn-sm";
  editBtn.innerText = "Edit";
  editBtn.onclick = () => editExpense(expense);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm";
  deleteBtn.innerText = "Delete";
  deleteBtn.onclick = () => deleteExpense(expense.id);

  btnDiv.append(editBtn, deleteBtn);
  li.append(btnDiv);
  expenseList.append(li);
}

async function deleteExpense(expenseId) {
  try {
    await axios.delete(`${BASE_URL}/expenses/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // await loadExpenses();
    await loadExpenses(currentPage);
  } catch (err) {
    console.log(err);
  }
}

function editExpense(expense) {
  amount.value = expense.amount;
  description.value = expense.description;
  category.value = expense.category;
  note.value = expense.note;
  editExpenseId = expense.id;
  submitBtn.innerHTML = "Update Expense";
}
