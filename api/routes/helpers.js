const runPython = require("../utils/pythonRunner");

function pick(body, keys) {
  for (const key of keys) {
    if (body && body[key] !== undefined && body[key] !== null) {
      return body[key];
    }
  }
  return undefined;
}

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function requireFields(res, fields) {
  const missing = fields.filter((field) => isBlank(field.value)).map((field) => field.name);

  if (!missing.length) return false;

  res.status(400).json({
    sucesso: false,
    mensagem: `Campos obrigatorios ausentes: ${missing.join(", ")}`,
  });
  return true;
}

function parseIndex(res, id) {
  const index = Number(id);

  if (!Number.isInteger(index) || index < 0) {
    res.status(400).json({
      sucesso: false,
      mensagem: "Indice invalido",
    });
    return null;
  }

  return index;
}

function handlePythonError(res, error) {
  console.error("[API] Falha ao executar Python:", error);
  res.status(500).json({
    sucesso: false,
    mensagem: "Falha ao executar backend Python",
    detalhe: error.message || String(error),
  });
}

async function runService(res, file, action, payload) {
  const args = [action];

  if (payload !== undefined) {
    args.push(JSON.stringify(payload));
  }

  const result = await runPython(file, args);
  res.json(result);
}

module.exports = {
  handlePythonError,
  parseIndex,
  pick,
  requireFields,
  runService,
};
