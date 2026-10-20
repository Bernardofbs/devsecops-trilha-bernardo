// "Banco de dados" em memória, só para fins didáticos (sem necessidade de
// instalar/configurar um banco real). Os dados são perdidos a cada restart —
// isso é aceitável para os objetivos da trilha.

let tasks = [
  { id: 1, title: "Configurar ambiente", done: true, owner: "mentoria" },
  { id: 2, title: "Estudar SAST vs DAST", done: true, owner: "mentoria" },
  { id: 3, title: "Montar pipeline no GitHub Actions", done: false, owner: "mentoria" },
  { id: 4, title: "Corrigir vulnerabilidades encontradas", done: false, owner: "mentoria" },
];

let nextId = tasks.length + 1;

function listTasks() {
  return tasks;
}

function getTask(id) {
  return tasks.find((t) => t.id === Number(id));
}

function createTask({ title, owner }) {
  const task = { id: nextId++, title, done: false, owner: owner || "anonimo" };
  tasks.push(task);
  return task;
}

function updateTask(id, changes) {
  const task = getTask(id);
  if (!task) return null;
  Object.assign(task, changes);
  return task;
}

function deleteTask(id) {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(id));
  return tasks.length < before;
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
