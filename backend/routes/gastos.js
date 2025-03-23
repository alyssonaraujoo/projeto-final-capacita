const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// Rota para listar todos os gastos
router.get("/gastos", async (req, res) => {
    try {
      const gastos = await prisma.gasto.findMany({ where: { userId: req.userId } });
      res.json(gastos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar gastos" });
    }
  });

  // Rota para buscar um gasto por ID
router.get("/gastos/:id", async (req, res) => {
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
router.post("/gastos" , async (req, res) => {
    try {
      const { descricao, valor, categoria, data } = req.body;
      const novoGasto = await prisma.gasto.create({
        data: { descricao, valor: parseFloat(valor), categoria, data: new Date(data), userId: req.userId},
      });
      res.status(201).json(novoGasto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao adicionar gasto" });
    }
  });

  // Rota para excluir um gasto por ID
router.delete("/gastos/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const gastoExiste = await prisma.gasto.findUnique({ where: { id } });
  
      if (!gastoExiste) {
        return res.status(404).json({ error: "Gasto não encontrado" });
      }
  
      await prisma.gasto.delete({ where: { id } });
  
      res.json({ message: "Gasto excluído com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir gasto" });
    }
  });

  // Rota para atualizar um gasto por ID
router.put("/gastos/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;

        if (!body.nome || !body.preco || !body.quantidade || !body.categoria) {
            return res.status(400).json({
                message: "Todos os campos obrigatórios devem ser preenchidos."
            });
        }

        const atualizaGasto = await prisma.gasto.update({ data: body, where: { id } })

        res.status(200).json({ messsage: "Gasto atualizado com sucesso" })

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o Gasto" });

    }

})