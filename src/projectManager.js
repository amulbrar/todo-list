import { Project } from "./project";

const projects = [new Project("Inbox"), new Project("Archive")];
let currentProject = projects[0];

function getProjects() {
    return projects;
}

function addProject(name) {
    const newProject = new Project(name);
    projects.push(newProject);
    return newProject;
}

function getCurrentProject() {
    return currentProject;
}

function switchProject(project) {
    currentProject = project;
}

function deleteProject(projectToDelete) {
    if (projectToDelete.name === "Inbox") {
        alert("Cannot delete the default Inbox project.");
        return;
    }

    const projectIndex = projects.findIndex(p => p === projectToDelete);
    if (projectIndex === -1) return;

    if (currentProject === projectToDelete) {
        switchProject(projects[0]);
    }

    projects.splice(projectIndex, 1);
}

export {
    getProjects,
    addProject,
    getCurrentProject,
    switchProject,
    deleteProject
};