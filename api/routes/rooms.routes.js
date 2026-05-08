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
const serviceFile = path.join("services", "sala_service.py");

router.post("/", async (req, res) => {
  const name = pick(req.body, ["name", "nome"]);

  if (requireFields(res, [{ name: "name", value: name }])) return;

  try {
    await runService(res, serviceFile, "criar", {
      nome: name,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

router.get("/", async (req, res) => {
  try {
    await runService(res, serviceFile, "listar");
  } catch (error) {
    handlePythonError(res, error);
  }
});

router.patch("/:id", async (req, res) => {
  const index = parseIndex(res, req.params.id);
  const name = pick(req.body, ["name", "nome"]);

  if (index === null) return;
  if (requireFields(res, [{ name: "name", value: name }])) return;

  try {
    await runService(res, serviceFile, "editar", {
      indice: index,
      nome: name,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

module.exports = router;
