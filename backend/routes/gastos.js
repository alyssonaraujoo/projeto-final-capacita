const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("../middleware/authMiddleware");
const prisma = new PrismaClient();
const router = express.Router();

// Rota para listar todos os gastos
router.get("/gastos", authenticateToken, async (req, res) => {
  const payerId = req.user?.userId; // Verificando o payerId a partir do token
  try {
    const gastos = await prisma.gasto.findMany({
      where: { payerId: payerId },
    });
    res.json(gastos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gastos" });
  }
});

// Rota para buscar um gasto por ID
router.get("/gasto/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gasto = await prisma.gasto.findUnique({ where: { id } });

    if (!gasto) {
      return res.status(404).json({ error: "Gasto não encontrado" });
    }

    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar gasto" });
  }
});

// Rota para adicionar um novo gasto
router.post("/new", authenticateToken, async (req, res) => {
  const payerId = req.user?.userId; // Verificando o payerId a partir do token
  const { descricao, valor, categoria, data, compartilhadoCom } = req.body;

  // Verificando se os campos necessários estão presentes
  if (
    !descricao ||
    !valor ||
    !compartilhadoCom ||
    compartilhadoCom.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Descrição, valor e compartilhamento são obrigatórios" });
  }

  try {
    // Criando o novo gasto
    const novoGasto = await prisma.gasto.create({
      data: {
        descricao,
        valor: parseFloat(valor),
        categoria,
        criadoEm: new Date(data),
        payerId,
      },
    });

    // Criando os compartilhamentos relacionados ao gasto
    const compartilhamentos = compartilhadoCom.map((user) => ({
      userId: user.userId, // ID do usuário com quem o gasto será compartilhado
      valor: user.valor, // Valor que o usuário pagará
      gastoId: novoGasto.id, // ID do gasto
      status: "Pendente", // Status do compartilhamento (por exemplo, Pendente, Pago)
    }));

    // Criando os registros de GastoCompartilhado
    await prisma.gastoCompartilhado.createMany({
      data: compartilhamentos,
    });

    res.status(201).json({
      gasto: novoGasto,
      compartilhamentos: compartilhamentos,
    });
  } catch (error) {
    console.error("Erro ao criar gasto:", error);
    res
      .status(500)
      .json({ error: "Erro ao adicionar gasto e compartilhamentos" });
  }
});

// Rota para excluir um gasto por ID
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  const payerId = req.user?.userId;
  const { id } = req.params;

  try {
    // Verificar se o gasto existe e se pertence ao usuário logado
    const gastoExiste = await prisma.gasto.findUnique({
      where: { id },
      select: { payerId: true },
    });

    if (!gastoExiste) {
      return res.status(404).json({ error: "Gasto não encontrado" });
    }

    if (gastoExiste.payerId !== payerId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para excluir este gasto" });
    }

    // Excluir os compartilhamentos associados
    await prisma.gastoCompartilhado.deleteMany({
      where: { gastoId: id },
    });

    // Excluir o gasto
    await prisma.gasto.delete({ where: { id } });

    res.json({ message: "Gasto excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir gasto:", error);
    res.status(500).json({ error: "Erro ao excluir gasto" });
  }
});



// Rota para atualizar um gasto por ID
router.put("/edit/:id", authenticateToken, async (req, res) => {
  const payerId = req.user?.userId;
  const { id } = req.params; // ID do gasto
  const { descricao, valor, categoria } = req.body; // Campos a serem atualizados

  try {
    // Verificar se os campos obrigatórios estão presentes
    if (!descricao || !valor || !categoria) {
      return res.status(400).json({
        message:
          "Descrição, valor e categoria são obrigatórios para atualização.",
      });
    }

    // Buscar o gasto para verificar se o payerId corresponde ao usuário logado
    const gastoExistente = await prisma.gasto.findUnique({
      where: { id },
    });

    if (!gastoExistente) {
      return res.status(404).json({ error: "Gasto não encontrado" });
    }

    // Verificar se o usuário logado é o responsável pelo gasto
    if (gastoExistente.payerId !== payerId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para editar este gasto" });
    }

    // Atualizar o gasto
    const atualizadoGasto = await prisma.gasto.update({
      where: { id },
      data: {
        descricao,
        valor: parseFloat(valor),
        categoria,
      },
    });

    res.status(200).json({
      message: "Gasto atualizado com sucesso",
      gasto: atualizadoGasto,
    });
  } catch (error) {
    console.error("Erro ao atualizar o Gasto:", error);
    res.status(500).json({ error: "Erro ao atualizar o Gasto" });
  }
});


module.exports = router;
