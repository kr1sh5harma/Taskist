let todos = [];
let counter = 0;

function addTodo() {
    const inputEl = document.getElementById("inp");
    const todoText = inputEl.value.trim();

    if (todoText === "") {
        alert("Please enter a todo!");
        return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleString();

    const todo = {
        id: counter,
        text: todoText,
        completed: false,
        createdAt: formattedDate
    };

    todos.push(todo);
    saveTodos();
    renderTodos();

    inputEl.value = "";
    counter++;
}

function renderTodos() {
    const parentEl = document.getElementById("todos");
    parentEl.innerHTML = ""; // clear before re-rendering

    todos.forEach((todo, index) => {
        const todoEl = document.createElement("div");
        todoEl.id = "todo-" + todo.id;
        todoEl.className = "todo-item";
        if (todo.completed) todoEl.classList.add("completed");

        todoEl.innerHTML = `
        <div>
        <span>${index + 1}. ${todo.text}</span>
        <small class="todo-date">Created: ${todo.createdAt}</small>
        </div>
            <div>
                <button onclick="toggleComplete(${todo.id})">
                    ${todo.completed ? "Undo" : "Done"}
                </button>
                <button onclick="editTodo(${todo.id})">Edit</button>
                <button onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;

        parentEl.appendChild(todoEl);
        updateProgress();
    });
}

function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    if (total === 0) {
        progressBar.style.width = "0%";
        progressText.style.opacity = 0; 
        return;
    }

    const percentage = (completed / total) * 100;
    progressBar.style.width = percentage + "%";
    progressText.textContent = `${completed} of ${total} completed`;

    progressText.style.opacity = 1;
}


function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt("Edit your todo:", todo.text);
    if (newText !== null && newText.trim() !== "") {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

function toggleComplete(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    const saved = JSON.parse(localStorage.getItem("todos")) || [];
    todos = saved;
    counter = todos.length;
    renderTodos();
}

window.onload = loadTodos;

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

window.addEventListener("load", ()=>{
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark"){
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️ Light Mode";
    }
})