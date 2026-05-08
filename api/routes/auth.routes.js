const express = require("express");
const path = require("path");
const {
  handlePythonError,
  pick,
  requireFields,
  runService,
} = require("./helpers");

const router = express.Router();
const serviceFile = path.join("services", "auth_service.py");

router.post("/login", async (req, res) => {
  const name = pick(req.body, ["name", "nome", "username", "usuario"]);
  const password = pick(req.body, ["password", "senha"]);

  if (requireFields(res, [
    { name: "name", value: name },
    { name: "password", value: password },
  ])) return;

  try {
    await runService(res, serviceFile, "login", {
      nome: name,
      senha: password,
    });
  } catch (error) {
    handlePythonError(res, error);
  }
});

module.exports = router;
