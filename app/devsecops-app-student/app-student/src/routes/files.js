const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const path = require("node:path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

// GET /api/files/:filename - lê arquivos somente da pasta uploads/
router.get("/:filename", (req, res) => {
  const { filename } = req.params;

  // Aceita apenas nomes simples de arquivo, sem diretórios.
  if (
    typeof filename !== "string" ||
    !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]{1,10}$/.test(filename)
  ) {
    return res.status(400).json({ error: "Nome de arquivo inválido" });
  }

  const filePath = path.resolve(UPLOADS_DIR, filename);
  const relativePath = path.relative(UPLOADS_DIR, filePath);

  // Impede caminhos que escapem do diretório uploads/.
  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return res.status(400).json({ error: "Caminho de arquivo inválido" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT" || err.code === "ENOTDIR") {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }

      return res.status(500).json({ error: "Erro ao ler arquivo" });
    }

    return res.type("text/plain").send(data);
  });
});

module.exports = router;
