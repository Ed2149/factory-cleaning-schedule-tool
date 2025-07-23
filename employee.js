const tasks = [
  { id: 1, text: "Clean Zone A", assignedTo: "employee@gearops.com", deadline: "2025-07-25", status: "Pending" },
  { id: 2, text: "Sanitize Packing", assignedTo: "employee@gearops.com", deadline: "2025-07-25", status: "Pending" }
];

const employeeTasks = document.getElementById('employeeTasks');
renderEmployeeTasks();

function renderEmployeeTasks() {
  employeeTasks.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `p-4 rounded bg-gray-800 border ${t.status === 'Completed' ? 'border-green-400' : 'border-yellow-400'}`;
    li.innerHTML = `
      <strong>${t.text}</strong><br>Deadline: ${t.deadline}<br>Status: ${t.status}
      <br><button onclick="markDone(${t.id})" class="mt-2 px-3 py-1 bg-cyan-500 rounded text-sm">Mark as Done</button>
    `;
    employeeTasks.appendChild(li);
  });
}

function markDone(id) {
  const task = tasks.find(t => t.id === id);
  task.status = 'Completed';
  renderEmployeeTasks();
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

