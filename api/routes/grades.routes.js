const express = require("express");
const path = require("path");
const {
  handlePythonError,
  pick,
  requireFields,
  runService,
} = require("./helpers");

const router = express.Router();
const serviceFile = path.join("services", "nota_service.py");

router.post("/", async (req, res) => {
  const student = pick(req.body, ["student", "aluno"]);
  const subject = pick(req.body, ["subject", "disciplina"]);
  const value = pick(req.body, ["value", "valor"]);

  if (requireFields(res, [
    { name: "student", value: student },
    { name: "subject", value: subject },
    { name: "value", value },
  ])) return;

  try {
    await runService(res, serviceFile, "criar", {
      aluno: student,
      disciplina: subject,
      valor: Number(value),
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

router.post("/student", async (req, res) => {
  const student = pick(req.body, ["student", "aluno"]);

  if (requireFields(res, [{ name: "student", value: student }])) return;

  try {
    await runService(res, serviceFile, "listar", {
      aluno: student,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

module.exports = router;
