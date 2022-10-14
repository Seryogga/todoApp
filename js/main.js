// Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];
let tasksLS = localStorage.getItem("tasks");
if (tasksLS) {
  tasks = JSON.parse(tasksLS);
	tasks.forEach((task) => renderTask(task));
}


checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", delTask);
tasksList.addEventListener("click", taskDone);

//add task function
function addTask(event) {
  event.preventDefault();
  const taskText = taskInput.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };
  tasks.push(newTask);
  saveToLS();
  renderTask(newTask);
  // clear fields and focus
  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
}
// delete Task function
function delTask(event) {
  if (event.target.dataset.action !== "delete") return;
  const parentNode = event.target.closest("li");
  const id = Number(parentNode.id);
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  //tasks = tasks.filter((task) => task.id !== id);
  saveToLS();
  parentNode.remove();
  checkEmptyList();
}
//mark task as Done function
function taskDone(event) {
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item");
  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLS();
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListElement = `
		<li id="emptyList" class="list-group-item empty-list">
		<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
		<div class="empty-list__title">List of Tasks is empty</div>
	</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListElement);
  } else {
    document.querySelector("#emptyList")
      ? document.querySelector("#emptyList").remove()
      : null;
  }
}

function saveToLS() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  const taskHTML = `
<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
	<span class="${cssClass}">${task.text}</span>
	<div class="task-item__buttons">
		<button type="button" data-action="done" class="btn-action">
			<img src="./img/tick.svg" alt="Done" width="18" height="18">
		</button>
		<button type="button" data-action="delete" class="btn-action">
			<img src="./img/cross.svg" alt="Done" width="18" height="18">
		</button>
	</div>
</li> `;
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
