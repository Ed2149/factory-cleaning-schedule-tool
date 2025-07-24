// === GearOps Backend Base URL ===
const BASE_URL = "https://factory-cleaning-schedule-tool.onrender.com";

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// === CREATE TASK ===
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById('taskText').value.trim(),
    description: "Auto-added from frontend",
    assigned_to: document.getElementById('assignedTo').value.trim(),
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
    loadTasks(); // Refresh list
  } catch (error) {
    console.error("Task create error:", error);
    alert("Error while sending task to server.");
  }
});

// === LOAD & DISPLAY TASKS ===
async function loadTasks() {
  try {
    const res = await fetch(`${BASE_URL}/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
    updateFogOpacity(tasks.filter(t => t.status.toLowerCase() === "pending").length);
  } catch (error) {
    console.error("Task fetch error:", error);
    alert("Could not load tasks.");
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `p-4 rounded bg-gray-800 border ${
      t.status.toLowerCase() === 'done' ? 'border-green-400' : 'border-yellow-400'
    }`;
    li.innerHTML = `
      <strong>${t.title}</strong><br>
      Assigned to: ${t.assigned_to}<br>
      Status: ${t.status}
    `;
    taskList.appendChild(li);
  });
}

// === FOG EFFECT BASED ON TASK LOAD ===
function updateFogOpacity(pendingCount) {
  const fog = document.getElementById('fogLayer');
  if (!fog) return;
  fog.style.opacity = pendingCount <= 5 ? '0.2' : pendingCount <= 15 ? '0.5' : '0.8';
}

function logout() {
  window.location.href = 'index.html';
}

// === INITIALIZE DASHBOARD ===
window.addEventListener("DOMContentLoaded", loadTasks);
