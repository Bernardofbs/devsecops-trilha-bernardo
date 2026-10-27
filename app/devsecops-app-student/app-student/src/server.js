
const express = require("express");
const _ = require("lodash");
const cookieParser = require("cookie-parser");
const Tokens = require("csrf");
const crypto = require("crypto");

const tasksRouter = require("./routes/tasks");
const networkRouter = require("./routes/network");
const filesRouter = require("./routes/files");

const app = express();
const PORT = process.env.PORT || 3000;

const cookieSigningSecret =
  process.env.COOKIE_SECRET || crypto.randomBytes(32).toString("hex");
const csrfTokens = new Tokens();

app.use(cookieParser(cookieSigningSecret));
app.use(express.json());

// Emite um token CSRF vinculado a um segredo armazenado em cookie assinado.
app.get("/csrf-token", (req, res) => {
  let secret = req.signedCookies.csrfSecret;

  if (typeof secret !== "string") {
    secret = csrfTokens.secretSync();
    res.cookie("csrfSecret", secret, {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  res.json({ csrfToken: csrfTokens.create(secret) });
});

// Exige um token válido em operações que alteram dados.
function csrfProtection(req, res, next) {
  const methodsThatChangeData = ["POST", "PUT", "PATCH", "DELETE"];

  if (!methodsThatChangeData.includes(req.method)) {
    return next();
  }

  const secret = req.signedCookies.csrfSecret;
  const token = req.get("CSRF-Token") || req.get("X-CSRF-Token");

  if (
    typeof secret !== "string" ||
    typeof token !== "string" ||
    !csrfTokens.verify(secret, token)
  ) {
    return res.status(403).json({
      error: "Token CSRF ausente ou inválido",
    });
  }

  return next();
}

// Origens autorizadas, configuradas pela variável ALLOWED_ORIGINS.
// Exemplo: ALLOWED_ORIGINS=http://localhost:5173
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

// Validação de Origin nas requisições que alteram dados.
// Adequada como defesa adicional para APIs sem autenticação por cookies.
app.use((req, res, next) => {
  const methodsThatChangeData = ["POST", "PUT", "PATCH", "DELETE"];

  if (!methodsThatChangeData.includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");

  // Clientes de terminal, como curl, podem não enviar Origin.
  if (!origin) {
    return next();
  }

  if (!allowedOrigins.has(origin)) {
    return res.status(403).json({
      error: "Origem não autorizada",
    });
  }

  return next();
});

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

app.use("/api/tasks", csrfProtection, tasksRouter);
app.use("/api", networkRouter);
app.use("/api/files", filesRouter);

app.listen(PORT, () => {
  console.log(`API de tarefas rodando na porta ${PORT}`);
});

module.exports = app;
