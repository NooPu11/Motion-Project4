const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage on page load
    window.onload = () => {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTask(task.text, task.completed));
    };

    function addTask(taskText, completed = false) {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <button>Delete</button>
        `;
        taskList.appendChild(li);

        // Add event listener to checkbox to mark task as completed or uncompleted
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            updateLocalStorage();
        });

        // Add event listener to delete button to delete task
        const deleteButton = li.querySelector('button');
        deleteButton.addEventListener('click', () => {
            li.remove();
            updateLocalStorage();
        });

        updateLocalStorage();
    }

    function updateLocalStorage() {
        const tasks = [];
        document.querySelectorAll('li').forEach(li => {
            const taskText = li.querySelector('span').innerText;
            const completed = li.classList.contains('completed');
            tasks.push({ text: taskText, completed: completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Add event listener to input field to add new task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            addTask(taskInput.value.trim());
            taskInput.value = '';
        }
    });