const express = require("express");
const _ = require("lodash");

const tasksRouter = require("./routes/tasks");
const networkRouter = require("./routes/network");
const filesRouter = require("./routes/files");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Healthcheck - usado pelo Render para saber se a aplicação está no ar.
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.json({
    message: "SACI DevSecOps - API de Tarefas (código-base da trilha)",
    endpoints: _.uniq([
      "GET  /health",
      "GET  /api/tasks",
      "GET  /api/tasks/:id",
      "POST /api/tasks",
      "PATCH /api/tasks/:id",
      "DELETE /api/tasks/:id",
      "GET  /api/tasks/filter?expr=...",
      "GET  /api/ping?host=...",
      "GET  /api/files/:filename",
    ]),
  });
});

app.use("/api/tasks", tasksRouter);
app.use("/api", networkRouter); // expõe GET /api/ping
app.use("/api/files", filesRouter);

app.listen(PORT, () => {
  console.log(`API de tarefas rodando na porta ${PORT}`);
});

module.exports = app;
