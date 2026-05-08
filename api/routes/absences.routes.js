const express = require("express");
const path = require("path");
const {
  handlePythonError,
  pick,
  requireFields,
  runService,
} = require("./helpers");

const router = express.Router();
const serviceFile = path.join("services", "falta_service.py");

router.post("/", async (req, res) => {
  const student = pick(req.body, ["student", "aluno"]);
  const date = pick(req.body, ["date", "data"]);

  if (requireFields(res, [
    { name: "student", value: student },
    { name: "date", value: date },
  ])) return;

  try {
    await runService(res, serviceFile, "criar", {
      aluno: student,
      data: date,
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
