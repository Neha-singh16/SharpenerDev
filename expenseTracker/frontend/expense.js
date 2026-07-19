// const BASE_URL = "http://localhost:3000/users";

const form = document.getElementById("expenseForm");

const expenseList = document.getElementById("expenseList");

const submitBtn = document.getElementById("submitBtn");
// premiumBtn.addEventListener("click", buyPremium);

const leaderboardBtn = document.getElementById("leaderboardBtn");

const leaderboardContainer = document.getElementById("leaderboardContainer");

const leaderboardList = document.getElementById("leaderboardList");
let editExpenseId = null;

// const cashfree = Cashfree({
//   mode: "sandbox",
// });

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

console.log(token);

window.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadExpenses();
  } catch (err) {
    console.log("Expense Error", err);
  }

  try {
    await checkPremiumStatus();
  } catch (err) {
    console.log("Premium Error", err);
  }
});

form.addEventListener("submit", addExpense);
// logoutBtn.addEventListener("click", logout);
leaderboardBtn.addEventListener("click", showLeaderboard);

async function loadExpenses() {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/expenses`, {
    headers: {
      // Authorization: token,
      Authorization: `Bearer ${token}`,
    },
  });
  expenseList.innerHTML = "";

  res.data.expense.forEach((exp) => {
    displayExpense(exp);
  });
  // console.log(res.data);
}

async function addExpense(e) {
  e.preventDefault();
  const expense = {
    amount: amount.value,

    description: description.value,

    category: category.value,
  };
  try {
    if (editExpenseId) {
      await axios.put(
        `${BASE_URL}/expenses/${editExpenseId}`,

        expense,
        {
          headers: {
            // Authorization: token,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      submitBtn.innerHTML = "Add Expense";
    } else {
      await axios.post(
        BASE_URL + "/expenses",

        expense,

        {
          headers: {
            // Authorization: token,
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
    form.reset();
    loadExpenses();
  } catch (err) {
    console.log(err);
  }
}

async function checkPremiumStatus() {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.isPremium) {
      document.getElementById("premiumCard").style.display = "block";
    } else {
      document.getElementById("buyPremiumCard").style.display = "block";
    }
  } catch (err) {
    console.log(err);
  }
}

async function showLeaderboard() {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BASE_URL}/purchase/leaderboard`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(res.data);
    leaderboardContainer.style.display = "block";

    leaderboardList.innerHTML = "";

    res.data.forEach((user, index) => {
      const li = document.createElement("li");

      li.className = "list-group-item";
      let medal = "";

      if (index === 0) {
        medal = "🥇";
      } else if (index === 1) {
        medal = "🥈";
      } else if (index === 2) {
        medal = "🥉";
      } else {
        medal = `${index + 1}.`;
      }
      li.innerHTML = `

<div class="d-flex justify-content-between">
<div>${medal}<strong>${user.name}</strong></div>
<div>₹${user.totalExpense}</div></div>`;

      leaderboardList.appendChild(li);
    });
  } catch (err) {
    console.log(err);
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

  btnDiv.append(editBtn);

  btnDiv.append(deleteBtn);

  li.append(btnDiv);

  expenseList.append(li);
}

async function deleteExpense(expenseId) {
  try {
    const res = await axios.delete(`${BASE_URL}/expenses/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadExpenses();
  } catch (err) {
    console.log(err);
  }
}

async function editExpense(expense) {
  amount.value = expense.amount;
  description.value = expense.description;
  category.value = expense.category;
  editExpenseId = expense.id;
  //  submitBtn.innerHTML = "Update";
  submitBtn.innerHTML = "Update Expense";
}
