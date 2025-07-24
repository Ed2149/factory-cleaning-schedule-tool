const employeeEmail = "employee@gearops.com"; // You can make this dynamic later
const employeeTasks = document.getElementById('employeeTasks');

// === Load and Render Tasks Assigned to This Employee ===
async function loadEmployeeTasks() {
  try {
    const res = await fetch("http://127.0.0.1:8000/tasks");
    const tasks = await res.json();

    const filtered = tasks.filter(t => t.assigned_to === employeeEmail);
    renderEmployeeTasks(filtered);

    const pendingCount = filtered.filter(t => t.status.toLowerCase() === "pending").length;
    updateFogOpacity(pendingCount);
  } catch (error) {
    console.error("Failed to load employee tasks:", error);
    alert("Could not fetch tasks from server.");
  }
}

// === Render Tasks in UI ===
function renderEmployeeTasks(tasks) {
  employeeTasks.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = `p-4 rounded bg-gray-800 border ${
      t.status.toLowerCase() === 'done' ? 'border-green-400' : 'border-yellow-400'
    }`;
    li.innerHTML = `
      <strong>${t.title}</strong><br>
      Deadline: ${t.deadline || 'N/A'}<br>
      Status: <span class="task-status">${t.status}</span><br>
    `;

    // Only show "Mark as Done" for incomplete tasks
    if (t.status.toLowerCase() !== "done") {
      const btn = document.createElement('button');
      btn.textContent = "Mark as Done";
      btn.className = "mt-2 px-3 py-1 bg-cyan-500 rounded text-sm";
      btn.onclick = () => markDone(t.id);
      li.appendChild(btn);
    }

    employeeTasks.appendChild(li);
  });
}

// === Update Task Status to "done" ===
async function markDone(taskId) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ status: "done" }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Failed to update status: ${err.detail}`);
      return;
    }

    loadEmployeeTasks(); // Refresh list after update
  } catch (error) {
    console.error("Error marking task as done:", error);
    alert("Could not update task.");
  }
}

// === Fog Density Logic ===
function updateFogOpacity(pendingCount) {
  const fog = document.getElementById('fogLayer');
  if (!fog) return;
  fog.style.opacity = pendingCount <= 5 ? '0.2' : pendingCount <= 15 ? '0.5' : '0.8';
}

function logout() {
  window.location.href = 'index.html';
}

// === Boot the Employee Dashboard ===
window.addEventListener("DOMContentLoaded", loadEmployeeTasks);
