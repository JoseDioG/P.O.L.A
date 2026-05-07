const express = require("express");
const app = express();
const runPython = require("./utils/pythonRunner");

app.use(express.json());

let occurrences = [];

// criar ocorrência
app.post("/occurrences", async (req, res) => {
  const { student, description } = req.body;

  try {
    const resultado = await runPython(
      "../backend/services/ocorrencia_service.py",
      [
        "criar",
        JSON.stringify({
          aluno: student,
          descricao: description,
          categoria: "DISCIPLINA",
          prioridade: "ALTA"
        })
      ]
    );

    res.json(resultado);

  } catch (err) {
    res.status(500).json({ erro: err });
  }
});

// listar ocorrências
app.get("/occurrences", async (req, res) => {
  try {
    const resultado = await runPython(
      "../backend/services/ocorrencia_service.py",
      ["listar"]
    );

    res.json(resultado);

  } catch (err) {
    res.status(500).json({ erro: err });
  }
});

// atualizar status
app.patch("/occurrences/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const resultado = await runPython(
      "../backend/services/ocorrencia_service.py",
      [
        "status",
        JSON.stringify({
          indice: Number(id),
          status
        })
      ]
    );

    res.json(resultado);

  } catch (err) {
    res.status(500).json({ erro: err });
  }
});

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});
