const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const amizadeRoutes = require("./routes/amizade");
const gastosRoutes = require("./routes/gastos");

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/amizade", amizadeRoutes);
app.use("/gastos", gastosRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
