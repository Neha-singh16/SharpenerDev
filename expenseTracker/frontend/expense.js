const BASE_URL = "http://localhost:3000/users";

const form = document.getElementById("expenseForm");

const expenseList = document.getElementById("expenseList");

const logoutBtn = document.getElementById("logoutBtn");

const submitBtn = document.getElementById("submitBtn");

let editExpenseId = null;

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", loadExpenses);
// logoutBtn.addEventListener("click", logout);
window.addEventListener("DOMContentLoaded", loadExpenses);

async function loadExpenses() {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${BASE_URL}/expenses`, {
    headers: {
      Authorization: token,
    },
  });

  console.log(res.data);
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
        `${BASE_URL}/${editExpenseId}`,

        expense,
        {
          headers: {
            Authorization: token,
          },
        },
      );
    } else {
      await axios.post(
        BASE_URL,

        expense,

        {
          headers: {
            Authorization: token,
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
