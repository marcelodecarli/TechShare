const API_URL = "http://localhost:3000/api/tasks";

async function fetchTasks() {
    try {
        const res = await fetch(
            API_URL, {
            method: "GET",
            credentials: "include",
        });
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        alert("Erro ao carregar tarefas");
        console.error(err);
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task-item";
        taskEl.innerHTML = `
  <strong>${task.title}</strong>
  <p>${task.description}</p>
  <small>Status: ${task.status}</small>
  <div class="task-actions">
    <button onclick="updateStatus(${task.id})">Alterar Status</button>
    <button onclick="deleteTask(${task.id})">Excluir</button>
  </div>
`;
        taskList.appendChild(taskEl);
    });
}

document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ title, description, status })
        });
        e.target.reset();
        fetchTasks();
    } catch (err) {
        alert("Erro ao criar tarefa");
    }
});

async function updateStatus(id) {
    try {
        const newStatus = prompt("Novo status (pending, in-progress, completed):");
        if (!newStatus) return;

        await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ status: newStatus })
        });

        fetchTasks();
    } catch (err) {
        alert("Erro ao atualizar status");
    }
}

async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        fetchTasks();
    } catch (err) {
        alert("Erro ao excluir tarefa");
    }
}

async function logout() {
    fetch("/api/users/logout", {
        method: "POST",
        credentials: "include" // envia o cookie
    })
        .then(res => {
            if (res.ok) {
                window.location.href = "/login.html";
            } else {
                alert("Erro ao sair!");
            }
        });
}

fetchTasks();