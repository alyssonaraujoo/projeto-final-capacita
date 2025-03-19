const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    res.status(400).json({ error: "Erro ao buscar usuários" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const newUser = await prisma.user.create({
      data: { email, password },
    });

    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

module.exports = router;
