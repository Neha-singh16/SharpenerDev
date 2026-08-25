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

// Base URL for API calls
// const BASE_URL = "http://localhost:3000/users";

let editExpenseId = null;
let allExpenses = [];
let hasAppliedFilter = false;
let filteredReportExpenses = [];
let leaderboardLoaded = false;
let isPremiumUser = false;
let currentPage = 1;
let ITEMS_PER_PAGE = Number(localStorage.getItem("itemsPerPage")) || 10;

itemsPerPage.addEventListener("change", () => {
  ITEMS_PER_PAGE = Number(itemsPerPage.value);

  localStorage.setItem("itemsPerPage", ITEMS_PER_PAGE);

  currentPage = 1;

  loadExpenses(1);
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
reportFilter.addEventListener("change", () => {
  hasAppliedFilter = false;
  filteredReportExpenses = [];
  renderFilterInputs();
});

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
async function loadExpenses(page = 1) {
  try {
    currentPage = page;

    const res = await axios.get(
      `${BASE_URL}/expenses?page=${currentPage}&itemsPerPage=${ITEMS_PER_PAGE}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Expenses response:", res.data);

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
    // category: category.value
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

    // Refresh leaderboard if it's being displayed
    if (leaderboardLoaded) {
      leaderboardLoaded = false;
      await showLeaderboard();
    }
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
  } else if (filter === "Weekly") {
    dynamicFilter.innerHTML = `
            <label>Start Date</label>
            <input type="date" id="startDate" class="form-control mb-2">

            <label>End Date</label>
            <input type="date" id="endDate" class="form-control">
        `;
  } else if (filter === "Monthly") {
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
  } else if (filter === "Yearly") {
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
      const selected = new Date(document.getElementById("selectedDate").value);

      return expenseDate.toDateString() === selected.toDateString();
    }

    if (filter === "Weekly") {
      const start = new Date(document.getElementById("startDate").value);

      const end = new Date(document.getElementById("endDate").value);

      end.setHours(23, 59, 59, 999);

      return expenseDate >= start && expenseDate <= end;
    }

    if (filter === "Monthly") {
      const month = Number(document.getElementById("selectedMonth").value);

      const year = Number(document.getElementById("selectedYear").value);

      return (
        expenseDate.getMonth() === month && expenseDate.getFullYear() === year
      );
    }

    if (filter === "Yearly") {
      const year = Number(document.getElementById("selectedYear").value);

      return expenseDate.getFullYear() === year;
    }

    return true;
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function updateReport() {
  const filter = reportFilter.value;

  // Validate the filter before applying it
  if (filter === "Daily") {
    const selectedDate = document.getElementById("selectedDate").value;

    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
  }

  if (filter === "Weekly") {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }
  }

  if (filter === "Monthly") {
    const year = document.getElementById("selectedYear").value;

    if (!year) {
      alert("Please select a year.");
      return;
    }
  }

  if (filter === "Yearly") {
    const year = document.getElementById("selectedYear").value;

    if (!year) {
      alert("Please select a year.");
      return;
    }
  }

  filteredReportExpenses = filterExpensesByPeriod(allExpenses, filter);

  hasAppliedFilter = true;

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

async function downloadReport() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    // User must apply filter first
    if (!hasAppliedFilter) {
      alert(
        "Please select a filter and click Apply Filter before downloading.",
      );
      return;
    }

    // Don't download an empty report
    if (filteredReportExpenses.length === 0) {
      alert("No expenses found for the selected filter.");
      return;
    }

    const filter = reportFilter.value;

    const filterData = {
      filter,
    };

    // ==========================================
    // DAILY
    // ==========================================

    if (filter === "Daily") {
      const selectedDate = document.getElementById("selectedDate").value;

      if (!selectedDate) {
        alert("Please select a date.");
        return;
      }

      filterData.selectedDate = selectedDate;
    }

    // ==========================================
    // WEEKLY
    // ==========================================

    if (filter === "Weekly") {
      const startDate = document.getElementById("startDate").value;

      const endDate = document.getElementById("endDate").value;

      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      if (new Date(startDate) > new Date(endDate)) {
        alert("Start date cannot be after end date.");
        return;
      }

      filterData.startDate = startDate;

      filterData.endDate = endDate;
    }

    // ==========================================
    // MONTHLY
    // ==========================================

    if (filter === "Monthly") {
      const month = document.getElementById("selectedMonth").value;

      const year = document.getElementById("selectedYear").value;

      if (!year) {
        alert("Please select a year.");
        return;
      }

      filterData.month = month;

      filterData.year = year;
    }

    // ==========================================
    // YEARLY
    // ==========================================

    if (filter === "Yearly") {
      const year = document.getElementById("selectedYear").value;

      if (!year) {
        alert("Please select a year.");
        return;
      }

      filterData.year = year;
    }

    console.log("Sending filter to backend:", filterData);

    // ==========================================
    // STEP 1: CREATE EXCEL FILE
    // ==========================================

    const res = await axios.post(`${BASE_URL}/download`, filterData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.success || !res.data.fileURL) {
      alert("Failed to generate Excel file.");
      return;
    }

    const filename = res.data.fileURL;

    // ==========================================
    // STEP 2: DOWNLOAD FILE
    // ==========================================

    const downloadUrl = `${BASE_URL}/download/${filename}`;

    const fileRes = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!fileRes.ok) {
      const errorData = await fileRes.json().catch(() => ({}));

      throw new Error(errorData.error || "Failed to download file.");
    }

    // ==========================================
    // STEP 3: DOWNLOAD BLOB
    // ==========================================

    const blob = await fileRes.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    console.log("Excel file downloaded successfully!");
  } catch (err) {
    console.error("Download error:", err);

    alert("Download failed: " + (err.response?.data?.error || err.message));
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
  deleteBtn.onclick = () => deleteExpense(expense._id);

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
  console.log("Editing expense:", expense);

  amount.value = expense.amount;
  description.value = expense.description;

  editExpenseId = expense._id;

  submitBtn.innerHTML = "Update Expense";
}
