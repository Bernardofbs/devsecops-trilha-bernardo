
const express = require("express");
const router = express.Router();
const { execFile } = require("node:child_process");
const { isIP } = require("node:net");

// Valida endereços IP e nomes de host DNS.
function isValidHost(host) {
  if (typeof host !== "string" || host.length === 0 || host.length > 253) {
    return false;
  }

  if (host !== host.trim()) {
    return false;
  }

  if (isIP(host)) {
    return true;
  }

  const hostname = host.endsWith(".") ? host.slice(0, -1) : host;

  if (!hostname) {
    return false;
  }

  return hostname.split(".").every((label) =>
    /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)
  );
}

// GET /api/ping?host=<endereço> - diagnóstico de rede
router.get("/ping", (req, res) => {
  const { host } = req.query;

  if (!host) {
    return res.status(400).json({
      error: "Parâmetro 'host' é obrigatório",
    });
  }

  if (!isValidHost(host)) {
    return res.status(400).json({
      error: "Endereço de host inválido",
    });
  }

  execFile(
    "ping",
    ["-c", "2", host],
    {
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    },
    (error, stdout, stderr) => {
      if (error) {
        return res.status(502).json({
          error: "Falha ao executar ping",
          details: stderr || error.message,
        });
      }

      return res.json({ host, output: stdout });
    }
  );
});

module.exports = router;
