const express = require("express");
const path = require("path");
const {
  handlePythonError,
  parseIndex,
  pick,
  requireFields,
  runService,
} = require("./helpers");

const router = express.Router();
const serviceFile = path.join("services", "ocorrencia_service.py");

router.post("/", async (req, res) => {
  const student = pick(req.body, ["student", "aluno"]);
  const description = pick(req.body, ["description", "descricao"]);
  const category = pick(req.body, ["category", "categoria"]) || "Comportamento inadequado";
  const priority = pick(req.body, ["priority", "prioridade"]) || "alta";

  if (requireFields(res, [
    { name: "student", value: student },
    { name: "description", value: description },
  ])) return;

  try {
    await runService(res, serviceFile, "criar", {
      aluno: student,
      descricao: description,
      categoria: category,
      prioridade: priority,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

router.get("/", async (req, res) => {
  const student = pick(req.query, ["student", "aluno"]);
  const payload = student ? { aluno: student } : undefined;

  try {
    await runService(res, serviceFile, "listar", payload);
  } catch (error) {
    handlePythonError(res, error);
  }
});

router.patch("/:id", async (req, res) => {
  const index = parseIndex(res, req.params.id);
  const status = pick(req.body, ["status"]);

  if (index === null) return;
  if (requireFields(res, [{ name: "status", value: status }])) return;

  try {
    await runService(res, serviceFile, "status", {
      indice: index,
      status,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

router.get("/:id/history", async (req, res) => {
  const index = parseIndex(res, req.params.id);
  if (index === null) return;

  try {
    await runService(res, serviceFile, "historico", {
      indice: index,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

module.exports = router;
