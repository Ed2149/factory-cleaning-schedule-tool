// === GearOps Backend Base URL ===
const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const showTaskForm = document.getElementById('showTaskForm');

const searchInput = document.getElementById('searchInput');
const filterZone = document.getElementById('filterZone');
const filterStatus = document.getElementById('filterStatus');
const filterDate = document.getElementById('filterDate');

// === Show/Hide Task Form ===
showTaskForm.onclick = () => taskForm.classList.toggle('hidden');

// === Create New Task ===
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = {
    title: document.getElementById('taskText').value.trim(),
    assigned_to: document.getElementById('assignedTo').value.trim(),
    deadline: document.getElementById('deadline').value,
    zone: document.getElementById('zone').value,
    status: document.getElementById('status').value
  };

  try {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Failed to create task: ${err.detail}`);
      return;
    }

    taskForm.reset();
    loadTasks(); // Refresh task list
  } catch (error) {
    console.error("Task creation error:", error);
    alert("Unable to create task.");
  }
});

// === Load Tasks from Backend ===
async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
    const pendingCount = tasks.filter(t => t.status.toLowerCase() === "pending").length;
    updateFogOpacity(pendingCount);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("Could not load tasks.");
  }
}

// === Filter & Render Tasks ===
function renderTasks(tasks) {
  const searchTerm = searchInput.value.toLowerCase();
  const zoneValue = filterZone.value;
  const statusValue = filterStatus.value;
  const dateValue = filterDate.value;

  taskList.innerHTML = '';

  tasks
    .filter(t => t.title.toLowerCase().includes(searchTerm) || t.assigned_to.toLowerCase().includes(searchTerm))
    .filter(t => !zoneValue || t.zone === zoneValue)
    .filter(t => !statusValue || t.status === statusValue)
    .filter(t => !dateValue || t.deadline === dateValue)
    .forEach(t => {
      const li = document.createElement('li');
      li.className = `p-4 rounded bg-gray-800 border transition ${
        t.status === 'Completed' || t.status.toLowerCase() === 'done' ? 'border-green-400' : 'border-yellow-400'
      } hover:scale-[1.02]`;
      li.innerHTML = `
        <strong>${t.title}</strong><br>
        Assigned to: ${t.assigned_to}<br>
        Zone: ${t.zone}<br>
        Deadline: ${t.deadline || 'N/A'}<br>
        Status: ${t.status}
      `;
      taskList.appendChild(li);
    });
}

// === Fog Opacity Based on Pending Load ===
function updateFogOpacity(pendingCount) {
  const fog = document.getElementById('fogLayer');
  if (!fog) return;
  fog.style.opacity = pendingCount <= 5 ? '0.2' : pendingCount <= 15 ? '0.5' : '0.8';
}

function logout() {
  window.location.href = 'index.html';
}

// === Live Filtering Events ===
searchInput.addEventListener('input', () => loadTasks());
filterZone.addEventListener('change', () => loadTasks());
filterStatus.addEventListener('change', () => loadTasks());
filterDate.addEventListener('change', () => loadTasks());

// === Boot Dashboard ===
window.addEventListener("DOMContentLoaded", loadTasks);
