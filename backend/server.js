const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://projeto-final-capacita-controle-de-gastos-qz4qj3tqb.vercel.app",
        "https://projeto-final-capacita-cont-git-8b1c44-arturs-projects-6052f39f.vercel.app",
        "https://projeto-final-capacita-controle-de-gastos.vercel.app",
        "http://localhost:5173",
      ];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS não permitido"), false);
      }
    }, // Permite apenas o front-end acessar
    credentials: true, // Permite cookies e headers de autenticação
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

require("dotenv").config();
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const amizadeRoutes = require("./routes/amizade");
const gastosRoutes = require("./routes/gastos");
const compartilhadosComigoRoutes = require("./routes/compartilhadosComigo");

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/amizade", amizadeRoutes);
app.use("/gastos", gastosRoutes);
app.use("/gastos", compartilhadosComigoRoutes);

// teste servidor
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
