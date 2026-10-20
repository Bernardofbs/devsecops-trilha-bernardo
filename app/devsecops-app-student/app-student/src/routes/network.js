const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// GET /api/ping?host=<endereço> - diagnóstico de rede
router.get("/ping", (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: "Parâmetro 'host' é obrigatório" });

  const command = "ping -c 2 " + host;
  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: "Falha ao executar ping", details: stderr });
    res.json({ host, output: stdout });
  });
});

module.exports = router;
