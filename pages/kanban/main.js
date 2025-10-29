// var for data
let tasks = [
  { type: "todo", id: 1, description: "Understand utility-first CSS" },
  { type: "todo", id: 2, description: "Design basic structure" },
  { type: "doing", id: 3, description: "Create a modal for editing tasks" },
  { type: "done", id: 4, description: "Setup environment" },
];
let lastId = 4;

let currentlyEdited = 0;

const createEditPopupDiv = document.querySelector(".task-popup");
const addDescriptionInput = document.getElementById("addDescriptionInput");
let types = document.querySelectorAll(".type");
let typeSelected;

const tasksDiv = document.querySelectorAll(".task");
const tasksContainers = document.querySelectorAll(".tasks");

const todoTasks = document.querySelector(".todo .tasks");
const doingTasks = document.querySelector(".doing .tasks");
const doneTasks = document.querySelector(".done .tasks");

const editTaskEvent = (taskDiv) => {
  taskDiv.addEventListener("click", (e) => {
    let id = e.currentTarget.getAttribute("data-id");
    let taskIndex = tasks.findIndex((task) => task.id == id);
    currentlyEdited = id;

    console.log("hi");
    addDescriptionInput.value = tasks[taskIndex].description;
    typeSelected = tasks[taskIndex].type;

    openPopupAnimation();
    selectType();
  });
};
const deleteTaskEvent = (deleteButton) => {
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = e.currentTarget.getAttribute("data-id");
    tasks = tasks.filter((task) => task.id != id);
    fillTasks();
  });
};

const applyDraggingEvent = (taskDiv) => {
  taskDiv.addEventListener("dragstart", () => {
    taskDiv.classList.add("dragging");
  });
  taskDiv.addEventListener("dragend", () => {
    taskDiv.classList.remove("dragging");
  });
};
tasksContainers.forEach((container) => {
  container.addEventListener("dragover", () => {
    const element = document.querySelector(".dragging");
    const type = container.getAttribute("data-type");
    const id = element.getAttribute("data-id");
    tasks = tasks.map((task, i) => {
      return { ...task, type: task.id == id ? type : task.type };
    });
    container.appendChild(element);
  });
});

const fillTasks = () => {
  todoTasks.innerHTML = "";
  doingTasks.innerHTML = "";
  doneTasks.innerHTML = "";

  tasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    const taskDescription = document.createElement("p");
    const deleteButton = document.createElement("span");

    taskDescription.textContent = task.description;
    deleteButton.setAttribute("data-id", task.id);
    deleteButton.classList.add("text-red-600");
    deleteButton.innerHTML = "<i class='fa-solid fa-trash'></i>";
    taskDiv.setAttribute("data-id", task.id);
    taskDiv.setAttribute("draggable", true);
    taskDiv.className =
      "task flex justify-between bg-white p-2 rounded shadow cursor-pointer hover:bg-gray-200";

    taskDiv.append(taskDescription);
    taskDiv.append(deleteButton);

    if (task.type === "todo") {
      todoTasks.appendChild(taskDiv);
    } else if (task.type === "doing") {
      doingTasks.appendChild(taskDiv);
    } else if (task.type === "done") {
      doneTasks.appendChild(taskDiv);
    }

    deleteTaskEvent(deleteButton);
    editTaskEvent(taskDiv);
    applyDraggingEvent(taskDiv);
  });
};

document.querySelector(".button-save-task").addEventListener("click", () => {
  typeSelected = typeSelected ?? "todo";
  const description = addDescriptionInput.value;
  if (currentlyEdited == 0) {
    tasks.push({ type: typeSelected, id: ++lastId, description });
  } else {
    tasks = tasks.map((task) =>
      task.id == currentlyEdited
        ? { ...task, description, type: typeSelected }
        : task
    );
    currentlyEdited = 0;
  }

  closePopupAnimation();
  fillTasks();
});

types.forEach((element) => {
  element.addEventListener("click", (e) => {
    typeSelected = element.getAttribute("data-type");
    selectType();
  });
});

document.querySelector(".button-add-task").addEventListener("click", () => {
  addDescriptionInput.value = "";
  typeSelected = "todo";
  openPopupAnimation();
  selectType();
});

document.querySelector(".exit").addEventListener("click", () => {
  closePopupAnimation();
});

function closePopupAnimation() {
  createEditPopupDiv.classList.remove("opacity-100");
  createEditPopupDiv.classList.add("opacity-0", "pointer-events-none");
}

function openPopupAnimation() {
  createEditPopupDiv.classList.remove("opacity-0", "pointer-events-none");
  createEditPopupDiv.classList.add("opacity-100");
}

const selectType = () => {
  types.forEach((e) => {
    e.disabled = e.getAttribute("data-type") == typeSelected;
    if (e.disabled) {
      e.classList.add("border-2", "border-black", "opacity-50");
      e.classList.remove("cursor-pointer");
    } else {
      e.classList.add("cursor-pointer");
      e.classList.remove("border-2", "border-black", "opacity-50");
    }
  });
};


fillTasks();
