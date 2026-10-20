# API de Tarefas — Código-base da Trilha de DevSecOps (SACI)

Esta é uma API REST simples de gerenciamento de tarefas (To-Do), em
Node.js + Express, usada como **projeto-alvo** ao longo dos Blocos 2 e 3 da
trilha de DevSecOps.

## Como rodar localmente

```bash
npm install
npm start
# API disponível em http://localhost:3000
```

## Como rodar com Docker

```bash
docker build -t task-api .
docker run -p 3000:3000 task-api
```

## Endpoints

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/health` | Healthcheck (usado pelo Render) |
| GET | `/api/tasks` | Lista todas as tarefas |
| GET | `/api/tasks/:id` | Busca uma tarefa pelo id |
| POST | `/api/tasks` | Cria uma nova tarefa (`{ "title": "...", "owner": "..." }`) |
| PATCH | `/api/tasks/:id` | Atualiza uma tarefa |
| DELETE | `/api/tasks/:id` | Remove uma tarefa |
| GET | `/api/tasks/filter?expr=...` | Filtro avançado de tarefas |
| GET | `/api/ping?host=...` | Diagnóstico de rede |
| GET | `/api/files/:filename` | Lê um arquivo da pasta `uploads/` |
