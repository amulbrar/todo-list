import { createTodo } from "./todo.js";
import {
    getProjects,
    addProject,
    getCurrentProject,
    switchProject,
    deleteProject
} from "./projectManager.js";

// -- Shared for editing --
let currentTodoBeingEdited = null;

function openEditDialog(todo) {
    const editTodoDialog = document.querySelector(".edit-todo-dialog");
    const editTitleInput = document.querySelector("#edit-title");
    const editDescriptionInput = document.querySelector("#edit-description");
    const editDueInput = document.querySelector("#edit-due");

    currentTodoBeingEdited = todo;

    editTitleInput.value = todo.title;
    editDescriptionInput.value = todo.description;
    editDueInput.value = todo.dueDate;

    const matchingPriority = document.querySelector(`input[name="edit-priority"][value="${todo.priority}"]`);
    if (matchingPriority) matchingPriority.checked = true;

    editTodoDialog.showModal();
}

function renderProjectList(projectsArray, switchProjectCallback) {
    const projectList = document.querySelector(".project-list");
    projectList.innerHTML = "";

    for (let projectObj of projectsArray) {
        const projectListItem = document.createElement("li");
        projectListItem.classList.add("project-list-item"); 

        const projectTitle = document.createElement("span");
        projectTitle.textContent = projectObj.name;
        projectTitle.classList.add("project-title");

        const projectDeleteBtn = document.createElement("button");
        projectDeleteBtn.textContent = "X";
        projectDeleteBtn.classList.add("project-delete-btn");

        projectTitle.addEventListener("click", () => {
            switchProjectCallback(projectObj);
        });

        projectDeleteBtn.addEventListener("click", () => {
            deleteProject(projectObj);

            renderProjectList(getProjects(), switchProjectCallback);
            renderTodoList(getCurrentProject(), openEditDialog);
        })

        projectListItem.appendChild(projectTitle);
        projectListItem.appendChild(projectDeleteBtn);

        projectList.appendChild(projectListItem);

    }
}

function renderTodoList(project, onTodoClick) {
    const todoList = document.querySelector(".todos-list");
    todoList.innerHTML = "";

    for (let i = 0; i < project.todos.length; i++) {
        const item = project.todos[i];
        const todo = document.createElement("li");
        todo.classList.add("todo-item");

        todo.style.borderLeft = `5px solid ${
            item.priority === "!!!" ? "red" :
            item.priority === "!!" ? "orange" :
            "green"
        }`;

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("title-div");

        const title = document.createElement("h4");
        title.classList.add("title");
        title.textContent = `${item.title}`;
        titleDiv.appendChild(title);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", () => {
            project.todos.splice(i, 1);
            renderTodoList(project, onTodoClick);
        });
        titleDiv.appendChild(deleteBtn);

        todo.appendChild(titleDiv);

        if (item.dueDate) { 
            const date = document.createElement("div");
            date.textContent = item.dueDate;
            date.classList.add("dueDate");
            todo.appendChild(date);
        }

        if (item.description) {
            const description = document.createElement("div");
            description.textContent = item.description;
            description.classList.add("description");
            todo.appendChild(description);
        }

        title.addEventListener("click", () => {
            onTodoClick(item);
        });

        todoList.appendChild(todo);
    }
}

function setupUI() {
    const addTaskBtn = document.querySelector(".task-btn");
    const addProjectBtn = document.querySelector(".project-btn");
    const projectDialog = document.querySelector(".project-dialog");
    const projectNameInput = document.querySelector("#project-name");
    const cancelBtn = document.querySelector(".cancel-btn");

    const taskCancelBtn = document.querySelector(".task-cancel-btn");
    const taskDialog = document.querySelector(".task-dialog");
    const taskTitleInput = document.querySelector("#task-title");
    const taskDescriptionInput = document.querySelector("#description");
    const dueDateInput = document.querySelector("#due-date");
    const taskForm = document.querySelector("#task-form");

    const editTodoDialog = document.querySelector(".edit-todo-dialog");
    const editCancelBtn = document.querySelector(".edit-cancel-btn");

    let taskFormSubmitted = false;

    renderProjectList(getProjects(), handleProjectSwitch);
    renderTodoList(getCurrentProject(), openEditDialog);

    addProjectBtn.addEventListener("click", () => {
        projectDialog.showModal();
    });

    cancelBtn.addEventListener("click", () => {
        projectDialog.close();
    });

    projectDialog.addEventListener("close", () => {
        const name = projectNameInput.value.trim();
        if (name !== "") {
            addProject(name);
            renderProjectList(getProjects(), handleProjectSwitch);
            projectNameInput.value = "";
        }
    });

    addTaskBtn.addEventListener("click", () => {
        taskDialog.showModal();
    });

    taskCancelBtn.addEventListener("click", () => {
        taskDialog.close();
    });

    taskForm.addEventListener("submit", () => {
        taskFormSubmitted = true;
    });

    taskDialog.addEventListener("close", () => {
        if (!taskFormSubmitted) return;

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const date = dueDateInput.value;
        const priorityInput = document.querySelector('input[name="priority"]:checked');
        const priority = priorityInput ? priorityInput.value : "";

        const newTodo = createTodo(title, description, date, priority);
        getCurrentProject().todos.push(newTodo);
        renderTodoList(getCurrentProject(), openEditDialog);

        taskTitleInput.value = "";
        taskDescriptionInput.value = "";
        dueDateInput.value = "";
        if (priorityInput) priorityInput.checked = false;

        taskFormSubmitted = false;
    });

    editCancelBtn.addEventListener("click", () => {
        editTodoDialog.close("cancel");
    });

    editTodoDialog.addEventListener("close", () => {
        if (editTodoDialog.returnValue === "cancel") {
            currentTodoBeingEdited = null;
            return;
        }

        if (!currentTodoBeingEdited) return;

        const editTitleInput = document.querySelector("#edit-title");
        const editDescriptionInput = document.querySelector("#edit-description");
        const editDueInput = document.querySelector("#edit-due");
        const priorityRadio = document.querySelector('input[name="edit-priority"]:checked');

        currentTodoBeingEdited.title = editTitleInput.value.trim();
        currentTodoBeingEdited.description = editDescriptionInput.value.trim();
        currentTodoBeingEdited.dueDate = editDueInput.value;
        currentTodoBeingEdited.priority = priorityRadio ? priorityRadio.value : "";

        renderTodoList(getCurrentProject(), openEditDialog);
        currentTodoBeingEdited = null;
    });
}

function handleProjectSwitch(project) {
    switchProject(project);
    renderTodoList(project, openEditDialog);
}

export { renderProjectList, renderTodoList, setupUI };