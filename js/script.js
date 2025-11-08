// Select elements
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

// Create popup container and overlay
const popupContainer = document.createElement('div');
popupContainer.id = 'popup-container';
const overlay = document.createElement('div');
overlay.className = 'popup-overlay';
document.body.appendChild(overlay);
document.body.appendChild(popupContainer);

// Show popup function
function showPopup(message, type) {
  const popup = document.createElement('div');
  popup.className = `popup ${type}`;
  popup.textContent = message;
  popupContainer.appendChild(popup);
  
  // Show overlay and popup
  overlay.classList.add('show');
  setTimeout(() => popup.classList.add('show'), 10);

  // Remove popup after animation
  setTimeout(() => {
    popup.classList.remove('show');
    overlay.classList.remove('show');
    setTimeout(() => popup.remove(), 400);
  }, 2500);
}

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="task-actions">
        <button onclick="toggleTask(${index})" title="Complete Task" class="action-btn complete-btn">
          <i class="fas fa-check-circle"></i>
        </button>
        <button onclick="editTask(${index})" title="Edit Task" class="action-btn edit-btn">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteTask(${index})" title="Delete Task" class="action-btn delete-btn">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;

    // Add interactive hover effects
    const taskText = li.querySelector('span');
    
    taskText.addEventListener('mouseover', () => {
      taskText.style.transform = 'scale(1.05)';
      taskText.style.background = 'rgba(224, 244, 255, 0.3)';
    });

    taskText.addEventListener('mouseout', () => {
      taskText.style.transform = 'scale(1)';
      taskText.style.background = 'transparent';
    });

    // Add double-click to toggle
    taskText.addEventListener('dblclick', () => toggleTask(index));

    taskList.appendChild(li);
  });
}

// Add new task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// Toggle completion
function toggleTask(index) {
  const taskElement = taskList.children[index];
  
  // Add completion animation
  taskElement.style.transform = 'scale(1.1)';
  taskElement.style.backgroundColor = '#e8f5e9';
  
  setTimeout(() => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    showPopup('🎉 Congratulations Thanaaz! 🎉\nYou\'ve completed another task!', 'success');
  }, 300);
}

// Delete task
function deleteTask(index) {
  const taskElement = taskList.children[index];
  taskElement.classList.add('deleting');
  
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    showPopup('Task deleted! 🗑️', 'delete');
  }, 300);
}

// Filter tasks
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

// Initialize
renderTasks();
