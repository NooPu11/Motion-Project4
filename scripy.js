const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const filters = document.querySelectorAll('.filter');
const emptyMessage = document.getElementById('emptyMessage');
const taskStats = document.getElementById('taskStats');

let currentFilter = 'all';

window.onload = () => {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach(task => addTask(task.text, task.completed));
  updateStats();
  updateVisibility();
};

addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text) {
    addTask(text);
    taskInput.value = '';
  } else {
    alert('Task cannot be empty!');
  }
});

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

filters.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    button.classList.add('active');
    currentFilter = button.getAttribute('data-filter');
    updateVisibility();
  });
});

function addTask(taskText, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  li.innerHTML = `
    <input type="checkbox" ${completed ? 'checked' : ''}>
    <span>${taskText}</span>
    <button>Delete</button>
  `;
  taskList.appendChild(li);

  li.querySelector('input').addEventListener('change', () => {
    li.classList.toggle('completed');
    updateLocalStorage();
    updateStats();
    updateVisibility();
  });

  li.querySelector('button').addEventListener('click', () => {
    li.remove();
    updateLocalStorage();
    updateStats();
    updateVisibility();
  });

  updateLocalStorage();
  updateStats();
  updateVisibility();
}

function updateLocalStorage() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('span').innerText;
    const completed = li.classList.contains('completed');
    tasks.push({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateStats() {
  const total = taskList.querySelectorAll('li').length;
  const completed = taskList.querySelectorAll('li.completed').length;
  const remaining = total - completed;
  taskStats.textContent = `${total} Tasks | ${completed} Completed | ${remaining} Remaining`;
}

function updateVisibility() {
  const allTasks = taskList.querySelectorAll('li');
  let visibleCount = 0;

  allTasks.forEach(task => {
    const isCompleted = task.classList.contains('completed');
    let show = false;

    if (currentFilter === 'all') show = true;
    else if (currentFilter === 'active') show = !isCompleted;
    else if (currentFilter === 'completed') show = isCompleted;

    task.style.display = show ? 'flex' : 'none';
    if (show) visibleCount++;
  });

  emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
}
