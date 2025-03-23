const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");
const prisma = new PrismaClient();
const router = express.Router();

router.post("/create", authenticateToken, async (req, res) => {
  const user1Id = req.user?.userId;
  const { user2Id } = req.body;


  if (!user1Id) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (!user2Id) {
    return res.status(400).json({ error: "ID do amigo não fornecido" });
  }

  if (user1Id === user2Id) {
    return res
      .status(400)
      .json({ error: "Você não pode adicionar a si mesmo como amigo" });
  }

  try {
    const user2 = await prisma.user.findUnique({
      where: { id: user2Id },
    });

    if (!user2) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const amizadeExistente = await prisma.amizade.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (amizadeExistente) {
      return res.status(400).json({ error: "Amizade já existe" });
    }

    const amizade = await prisma.amizade.create({
      data: { user1Id, user2Id },
    });

    res.status(201).json(amizade);
  } catch (error) {
    console.error("Erro ao criar amizade:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const findAmizade = await prisma.amizade.findUnique({
      where: { id },
    });

    if (!findAmizade) {
      return res.status(404).json({ message: "Amizade não encontrada" });
    }

    await prisma.amizade.delete({
      where: {
        id
      },
    });

    res.status(202).json({ message: "Amizade deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar amizade:", error);
    res.status(500).json({ error: "Erro ao deletar amizade" });
  }
});

module.exports = router;
