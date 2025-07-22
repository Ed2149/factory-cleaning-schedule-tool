const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const showTaskForm = document.getElementById('showTaskForm');

const tasks = [];

showTaskForm.onclick = () => taskForm.classList.toggle('hidden');

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = {
    id: Date.now(),
    text: document.getElementById('taskText').value.trim(),
    assignedTo: document.getElementById('assignedTo').value.trim(),
    deadline: document.getElementById('deadline').value,
    zone: document.getElementById('zone').value,
    status: document.getElementById('status').value
  };
  tasks.push(task);
  taskForm.reset();
  renderTasks();
});

document.getElementById('searchInput').addEventListener('input', renderTasks);
document.getElementById('filterZone').addEventListener('change', renderTasks);
document.getElementById('filterStatus').addEventListener('change', renderTasks);
document.getElementById('filterDate').addEventListener('change', renderTasks);

function renderTasks() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filterZone = document.getElementById('filterZone').value;
  const filterStatus = document.getElementById('filterStatus').value;
  const filterDate = document.getElementById('filterDate').value;

  taskList.innerHTML = '';

  tasks
    .filter(t => t.text.toLowerCase().includes(searchTerm) || t.assignedTo.toLowerCase().includes(searchTerm))
    .filter(t => !filterZone || t.zone === filterZone)
    .filter(t => !filterStatus || t.status === filterStatus)
    .filter(t => !filterDate || t.deadline === filterDate)
    .forEach(t => {
      const li = document.createElement('li');
      li.className = `p-4 rounded bg-gray-800 border transition ${
        t.status === 'Completed' ? 'border-green-400' : 'border-yellow-400'
      } hover:scale-[1.02]`;
      li.innerHTML = `
        <strong>${t.text}</strong><br>
        Assigned to: ${t.assignedTo}<br>
        Zone: ${t.zone}<br>
        Deadline: ${t.deadline}<br>
        Status: ${t.status}
      `;
      taskList.appendChild(li);
    });
}

function logout() {
  window.location.href = 'index.html';
}
