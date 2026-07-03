console.log("JS Loaded");


const form = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

const BASE_URL = "http://localhost:3000/expenses";
window.addEventListener("DOMContentLoaded",loadExpenses());

form.addEventListener("submit", addExpense);

async function loadExpenses(){
    try{
        const res = await axios.get(BASE_URL);
        console.log(res.data);
      expenseList.innerHTML = "";
      res.data.forEach(displayExpense);

    }catch(err){
         console.log(err);
    }
}


async function addExpense(e){
    e.preventDefault();
    const expense ={
      amount : document.getElementById("amount").value,
      description : document.getElementById("description").value,
      category :document.getElementById("category").value
    };

    try{
        const res = await axios.post(BASE_URL, expense);
        console.log(res.data);
        displayExpense(res.data);
        // loadExpenses(); // Refresh the expense list
        form.reset();
    }catch(err){
        console.log(err);
    }
}

async function displayExpense(expense){
    const li = document.createElement("li");
    li.innerHTML = `<strong>${expense.description}</strong> - ${expense.amount} - ${expense.category}
    <br><br>
    <button class="actionBtn" onclick="deleteExpense(${expense.id})">Delete</button>`
    expenseList.appendChild(li);
}

async function deleteExpense(expenseId){
    try{
        await axios.delete(`${BASE_URL}/${expenseId}`);
        loadExpenses();

    }catch(err){
          console.log(err);
    }
}