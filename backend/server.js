const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
