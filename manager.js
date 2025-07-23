const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const tasks = [];

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = {
    id: Date.now(),
    text: document.getElementById('taskText').value.trim(),
    assignedTo: document.getElementById('assignedTo').value.trim(),
    deadline: document.getElementById('deadline').value,
    status: document.getElementById('status').value
  };
  tasks.push(task);
  taskForm.reset();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `p-4 rounded bg-gray-800 border ${
      t.status === 'Completed' ? 'border-green-400' : 'border-yellow-400'
    }`;
    li.innerHTML = `<strong>${t.text}</strong><br>Assigned to: ${t.assignedTo}<br>Deadline: ${t.deadline}<br>Status: ${t.status}`;
    taskList.appendChild(li);
  });
}

function logout() {
  window.location.href = 'index.html';
}

function updateFogOpacity(pendingCount) {
  const fog = document.getElementById('fogLayer');
  if (!fog) return;
  if (pendingCount <= 5) {
    fog.style.opacity = '0.2';
  } else if (pendingCount <= 15) {
    fog.style.opacity = '0.5';
  } else {
    fog.style.opacity = '0.8';
  }
}

// Example: update based on real-time count from DOM
const pendingTasks = document.querySelectorAll('.task-status')
  ? Array.from(document.querySelectorAll('.task-status'))
    .filter(el => el.textContent.includes('Pending')).length
  : 0;

updateFogOpacity(pendingTasks);
