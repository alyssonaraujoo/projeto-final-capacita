const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");

const prisma = new PrismaClient();

router.get("/compartilhados_comigo", authMiddleware, async (req, res) => {
  const userId = req.user?.userId;

  try {
    const gastosCompartilhados = await prisma.gastoCompartilhado.findMany({
      where: { userId },
      include: {
        gasto: {
          include: {
            payer: true,
          },
        },
      },
    });

    if (!userId) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(gastosCompartilhados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

router.get("/compartilhados_comigo/:id", authMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  try {
    const gastosCompartilhados = await prisma.gastoCompartilhado.findMany({
      where: { userId, id },
    });

    if (!userId) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(gastosCompartilhados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gasto" });
  }
});

module.exports = router;
