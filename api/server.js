require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");

const occurrencesRoutes = require("./routes/occurrences.routes");
const studentsRoutes = require("./routes/students.routes");
const roomsRoutes = require("./routes/rooms.routes");
const gradesRoutes = require("./routes/grades.routes");
const absencesRoutes = require("./routes/absences.routes");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    mensagem: "API POLAR online",
    rotas: [
      "/occurrences",
      "/students",
      "/rooms",
      "/grades",
      "/absences",
      "/auth",
      "/users",
    ],
  });
});

app.get("/health", (req, res) => {
  res.json({
    sucesso: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/occurrences", occurrencesRoutes);
app.use("/students", studentsRoutes);
app.use("/rooms", roomsRoutes);
app.use("/grades", gradesRoutes);
app.use("/absences", absencesRoutes);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: "Rota nao encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error("[API] Erro inesperado:", err);
  res.status(500).json({
    sucesso: false,
    mensagem: "Erro interno da API",
    detalhe: err.message || String(err),
  });
});

app.listen(PORT, HOST, () => {
  console.log(`API POLAR rodando em http://${HOST}:${PORT}`);
});
