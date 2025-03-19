const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/create", async (req, res) => {
  const { user1Id, user2Id } = req.body;

  try {
    const amizadeExistente = await prisma.amizade.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    if (amizadeExistente) {
      return res
        .status(400)
        .json({ error: "Amizade já existe entre os usuários." });
    }

    const amizade = await prisma.amizade.create({
      data: {
        user1Id,
        user2Id,
      },
    });
    res.status(201).json(amizade);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar amizade" });
  }
});

module.exports = router;
