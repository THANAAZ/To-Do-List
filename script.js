// 1. GET REFERENCES TO THE HTML ELEMENTS (DOM)
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn'); // For bonus feature

// 2. INITIAL STATE & LOCAL STORAGE SETUP
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Function to save the tasks array to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- CORE FUNCTIONALITY ---

// Function to ADD a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task description.");
        return;
    }

    const newTask = {
        id: Date.now(), // Simple unique ID
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    saveTasks();
    renderTasks(); 
}

// Function to TOGGLE a task's status
function toggleTask(id) {
    // Loop through tasks to find and flip the status
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed;
            break; 
        }
    }
    saveTasks();
    renderTasks();
}

// Function to DELETE a task
function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    // Filter out the task that matches the ID
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    
    saveTasks();
    renderTasks();
}

// Function to CLEAR all completed tasks (Bonus)
function clearCompletedTasks() {
    if (!confirm("Are you sure you want to permanently clear all completed tasks?")) return;
    
    // Keep only the tasks that are NOT completed (i.e., active)
    tasks = tasks.filter(function(task) {
        return task.completed === false;
    });

    saveTasks();
    renderTasks();
}

// Function to CHANGE the filter view
function setFilter(filterType) {
    currentFilter = filterType;
    
    // Update active button styles
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filterType) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}

// --- RENDERING (Drawing the List on Screen) ---

function renderTasks() {
    taskList.innerHTML = ''; 

    let tasksToShow = tasks;

    // Apply Filter Logic
    if (currentFilter === 'active') {
        tasksToShow = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        tasksToShow = tasks.filter(task => task.completed);
    }
    
    // Loop through and create HTML for each task
    tasksToShow.forEach(function(task) {
        const li = document.createElement('li');
        
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        // Template string for the task HTML
        li.innerHTML = `
            <button class="toggle-btn" data-id="${task.id}">
                ${task.completed ? '<i class="fas fa-check"></i>' : ''}
            </button>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" data-id="${task.id}" title="Delete">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        taskList.appendChild(li);
    });
}


// 4. SET UP EVENT LISTENERS

// Listener for the "Add" button
addTaskBtn.addEventListener('click', addTask);

// Listener for the Enter key
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Listener for list actions (Toggle and Delete)
taskList.addEventListener('click', function(e) {
    const buttonClicked = e.target.closest('.toggle-btn') || e.target.closest('.delete-btn');
    
    if (buttonClicked) {
        const taskId = parseInt(buttonClicked.getAttribute('data-id'));

        if (buttonClicked.classList.contains('toggle-btn')) {
            toggleTask(taskId);
        } else if (buttonClicked.classList.contains('delete-btn')) {
            deleteTask(taskId);
        }
    }
});

// Listener for the Filter buttons
filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter');
        setFilter(filterType);
    });
});

// Listener for "Clear All Completed"
clearCompletedBtn.addEventListener('click', clearCompletedTasks);


// 5. INITIAL CALL
// Load tasks and render the list when the page loads
document.addEventListener('DOMContentLoaded', renderTasks);