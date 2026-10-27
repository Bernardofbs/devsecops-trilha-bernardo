
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/tasks - lista todas as tarefas
router.get("/", (req, res) => {
  res.json(db.listTasks());
});

// GET /api/tasks/filter?expr=title=Relatorio
// Campos permitidos: id, title, owner
// Operadores permitidos: =, !=
router.get("/filter", (req, res) => {
  const { expr } = req.query;

  if (typeof expr !== "string" || !expr.trim()) {
    return res.status(400).json({
      error: "Informe o filtro no formato campo=valor",
    });
  }

  const match = expr.match(
    /^\s*(id|title|owner)\s*(=|!=)\s*(.*?)\s*$/
  );

  if (!match) {
    return res.status(400).json({
      error:
        "Filtro inválido. Use id, title ou owner com = ou !=.",
    });
  }

  const [, field, operator, rawValue] = match;
  let value = rawValue.trim();

  // Permite valores entre aspas, por exemplo: title="Minha tarefa"
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (!value) {
    return res.status(400).json({
      error: "O valor do filtro não pode estar vazio",
    });
  }

  const normalizedValue = value.toLowerCase();

  const result = db.listTasks().filter((task) => {
    if (
      !task ||
      !Object.prototype.hasOwnProperty.call(task, field)
    ) {
      return false;
    }

    const actualValue = String(task[field] ?? "").toLowerCase();

    return operator === "="
      ? actualValue === normalizedValue
      : actualValue !== normalizedValue;
  });

  return res.json(result);
});

// GET /api/tasks/:id - busca uma tarefa pelo id
router.get("/:id", (req, res) => {
  const task = db.getTask(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Tarefa não encontrada",
    });
  }

  res.json(task);
});

// POST /api/tasks - cria uma nova tarefa
router.post("/", (req, res) => {
  const { title, owner } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Campo 'title' é obrigatório",
    });
  }

  const task = db.createTask({ title, owner });
  res.status(201).json(task);
});

// PATCH /api/tasks/:id - atualiza uma tarefa
router.patch("/:id", (req, res) => {
  const task = db.updateTask(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({
      error: "Tarefa não encontrada",
    });
  }

  res.json(task);
});

// DELETE /api/tasks/:id - remove uma tarefa
router.delete("/:id", (req, res) => {
  const ok = db.deleteTask(req.params.id);

  if (!ok) {
    return res.status(404).json({
      error: "Tarefa não encontrada",
    });
  }

  res.status(204).end();
});

module.exports = router;
