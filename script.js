const taskList = document.getElementById("taskList");

loadTasks();

// ---------------- ADD TASK ----------------

function addTask() {

    const taskInput = document.getElementById("taskInput");
    const dueDate = document.getElementById("dueDate");
    const priority = document.getElementById("priority");

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    // Duplicate Check
    let duplicate = false;

    document.querySelectorAll(".task-info span:first-child").forEach(task => {

        if (task.innerText.toLowerCase() === taskText.toLowerCase()) {
            duplicate = true;
        }

    });

    if (duplicate) {
        alert("Task already exists.");
        return;
    }

    createTask(
        taskText,
        dueDate.value,
        priority.value,
        false
    );

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "Low";

    saveTasks();

}

// ---------------- CREATE TASK ----------------

function createTask(text, date, priority, completed) {

    const li = document.createElement("li");

    li.innerHTML = `

    <div class="task-info">

        <span class="${completed ? "completed" : ""}">
            ${text}
        </span>

        <small class="task-date">
            📅 ${date || "No Date"}
        </small>

        <small class="priority ${priority.toLowerCase()}">
            ${priority}
        </small>

    </div>

    <div>

        <button onclick="toggleTask(this)">
            ✔
        </button>

        <button class="edit" onclick="editTask(this)">
            ✏
        </button>

        <button class="delete" onclick="deleteTask(this)">
            ❌
        </button>

    </div>

    `;

    taskList.appendChild(li);

    updateStats();

}

// ---------------- COMPLETE ----------------

function toggleTask(btn) {

    const task = btn.parentElement.previousElementSibling.firstElementChild;

    task.classList.toggle("completed");

    saveTasks();

    updateStats();

}

// ---------------- EDIT ----------------

function editTask(btn) {

    const task =
        btn.parentElement.previousElementSibling.firstElementChild;

    const newTask = prompt(
        "Edit Task",
        task.innerText
    );

    if (newTask === null) return;

    if (newTask.trim() === "") {

        alert("Task cannot be empty.");

        return;

    }

    task.innerText = newTask.trim();

    saveTasks();

}

// ---------------- DELETE ----------------

function deleteTask(btn) {

    if (confirm("Delete this task?")) {

        btn.parentElement.parentElement.remove();

        saveTasks();

        updateStats();

    }

}

// ---------------- STATS ----------------

function updateStats() {

    const total =
        document.querySelectorAll("#taskList li").length;

    const completed =
        document.querySelectorAll(".completed").length;

    document.getElementById("total").innerText = total;

    document.getElementById("completed").innerText = completed;

    document.getElementById("pending").innerText =
        total - completed;

}

// ---------------- SAVE ----------------

function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {

        tasks.push({

            text:
                li.querySelector(".task-info span").innerText,

            date:
                li.querySelector(".task-date")
                .innerText.replace("📅 ", ""),

            priority:
                li.querySelector(".priority").innerText,

            completed:
                li.querySelector(".task-info span")
                .classList.contains("completed")

        });

    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

// ---------------- LOAD ----------------

function loadTasks() {

    const tasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {

        createTask(

            task.text,

            task.date === "No Date" ? "" : task.date,

            task.priority || "Low",

            task.completed

        );

    });

}

// ---------------- CLEAR ----------------

function clearAllTasks() {

    if (confirm("Delete all tasks?")) {

        taskList.innerHTML = "";

        localStorage.removeItem("tasks");

        updateStats();

    }

}

// ---------------- SEARCH ----------------

document.getElementById("searchTask")
.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll("#taskList li")
        .forEach(task => {

            const text =
                task.querySelector(".task-info span")
                .innerText.toLowerCase();

            task.style.display =
                text.includes(value)
                    ? "flex"
                    : "none";

        });

});

// ---------------- ENTER KEY ----------------

document.getElementById("taskInput")
.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        addTask();

    }

});

// ---------------- SORT ----------------

function sortTasks() {

    const tasks =
        [...document.querySelectorAll("#taskList li")];

    tasks.sort((a, b) => {

        const d1 =
            a.querySelector(".task-date").innerText.replace("📅 ", "");

        const d2 =
            b.querySelector(".task-date").innerText.replace("📅 ", "");

        if (d1 === "No Date") return 1;

        if (d2 === "No Date") return -1;

        return new Date(d1) - new Date(d2);

    });

    taskList.innerHTML = "";

    tasks.forEach(task => taskList.appendChild(task));

    saveTasks();

}

// ---------------- DARK MODE ----------------

const themeBtn = document.getElementById("themeBtn");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    themeBtn.innerText = "☀ Light Mode";

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerText = "☀ Light Mode";

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerText = "🌙 Dark Mode";

    }

});