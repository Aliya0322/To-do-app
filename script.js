document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // Проверка на null
    if (Array.isArray(storedTasks)) {
        storedTasks.forEach((task) => tasks.push(task)); // Загрузка сохраненных задач
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

// Сохранение задач в localStorage
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Добавление задачи
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput) return; // Проверка наличия элемента

    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = ""; // Очистка поля ввода
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

// Удаление задачи
const deleteTask = (index) => {
    tasks.splice(index, 1); // Удаление задачи
    updateTasksList();
    updateStats();
    saveTasks();
};

// Редактирование задачи
const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    if (!taskInput) return;

    taskInput.value = tasks[index].text; // Перенос текста задачи в поле ввода
    tasks.splice(index, 1); // Удаление задачи из списка
    updateTasksList();
    updateStats();
    saveTasks();
};

let confettiLaunched = false;

// Обновление статистики задач
const updateStats = () => {
    const completeTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;

    const progress = totalTasks > 0 ? (completeTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById("progress");
    if (progressBar) progressBar.style.width = `${progress}%`;

    const numbers = document.getElementById("numbers");
    if (numbers) numbers.innerText = `${completeTasks}/${totalTasks}`;

    if (tasks.length > 0 && completeTasks === totalTasks) {
        blastConfetti(); // Вызов конфетти
        confettiLaunched = true;
    }
    if (completeTasks < totalTasks) {
        confettiLaunched = false;
    }
};

// Переключение статуса выполнения задачи
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed; // Переключение статуса задачи
    updateTasksList();
    updateStats();
    saveTasks();
};

// Обновление списка задач
const updateTasksList = () => {
    const taskList = document.getElementById("task-list");
    if (!taskList) return; // Проверка наличия элемента

    taskList.innerHTML = ""; // Очистка списка задач

    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.className = "TaskItem";

        // Создание разметки задачи
        listItem.innerHTML = `
            <div class="task ${task.completed ? "completed" : ""}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="image/edit.png" alt="Edit" onClick="editTask(${index})">
                <img src="image/bin.png" alt="Delete" onClick="deleteTask(${index})">
            </div>
        `;

        // Привязка события к чекбоксу
        const checkbox = listItem.querySelector(".checkbox");
        checkbox.addEventListener("change", () => toggleTaskComplete(index));

        taskList.appendChild(listItem);
    });
};

// Привязка события к кнопке добавления задачи
document.getElementById("newTask")?.addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});


