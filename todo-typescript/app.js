"use strict";
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
const taskName = document.getElementById("taskName");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
        const li = document.createElement("li");
        const info = document.createElement("div");
        info.className = "task-info";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });
        const span = document.createElement("span");
        span.textContent = `${task.name} - Due: ${task.dueDate}`;
        if (task.completed) {
            span.classList.add("completed");
        }
        info.appendChild(checkbox);
        info.appendChild(span);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => {
            tasks = tasks.filter((t) => t.id !== task.id);
            saveTasks();
            renderTasks();
        });
        li.appendChild(info);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}
addBtn.addEventListener("click", () => {
    if (taskName.value.trim() === "") {
        alert("Task name cannot be empty");
        return;
    }
    if (dueDate.value === "") {
        alert("Select due date");
        return;
    }
    const task = {
        id: Date.now(),
        name: taskName.value.trim(),
        dueDate: dueDate.value,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskName.value = "";
    dueDate.value = "";
});
renderTasks();
