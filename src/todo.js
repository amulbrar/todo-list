function createTodo(title, description, dueDate, priority) {
    return {
        title, 
        description,
        dueDate,
        priority,
        isComplete: false,
        toggleComplete() {
            this.isComplete = !this.isComplete;
        }
    };
}

function updateTodo(todo, { title, description, dueDate, priority }) {
    todo.title = title;
    todo.description = description;
    todo.dueDate = dueDate;
    todo.priority = priority;
}

export { createTodo, updateTodo };