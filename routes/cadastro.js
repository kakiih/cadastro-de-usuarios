const express = require("express");
const cadastro = require("../db/db");
const router = express.Router();

router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

router.post("/cadastro", (req, res) => {
  const cpflimpo = req.body.cpf.replace(/\./g, "").replace(/-/g, "");
  if (cpflimpo.length !== 11) {
    return res.status(400).send("CPF inválido!");
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const email = req.body.email;
  if (!regex.test(email)) {
    return res.status(400).send(`email invalido.`);
  }
  cadastro
    .create({
      email: email,
      senha: req.body.senha,
      cpf: cpflimpo,
    })
    .then(() => {
      res.status(200).send(`Usuario cadastrado com sucesso!`);
    })
    .catch((erro) => {
      if (erro.name === "SequelizeUniqueConstraintError") {
        return res.status(400).send(`Usuario ja cadastrado!`);
      } else {
        return res
          .status(500)
          .send(`Erro ao cadastrar o usuario, erro: ${erro}`);
      }
    });
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await cadastro.findAll();
    res.status(200).json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: `erro ao listar usuarios, erro: ${erro}` });
  }
});

router.get("/:cpf", async (req, res) => {
  try {
    const cpflimpo = req.params.cpf.trim();
    if (cpflimpo.length !== 11) {
      return res.status(400).send({ erro: `CPF inválido` });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res
      .status(500)
      .send({ erro: `erro ao listar usuario, erro: ${erro}` });
  }
});

router.delete("/delete/:cpf", async (req, res) => {
  try {
    const cpflimpo = req.params.cpf.trim();
    if (cpflimpo.length !== 11) {
      return res.status(400).send({ erro: `CPF inválido` });
    }
    const usuario = await cadastro.findByPk(cpflimpo);
    if (usuario === null) {
      return res.status(404).json({ erro: `usuario não encontrado` });
    }
    await cadastro.destroy({ where: { cpf: cpflimpo } });
    return res.status(200).json({ ok: `usuario deletado com sucesso` });
  } catch (erro) {
    res.status(500).json({ erro: `erro ao deletar usuario, erro: ${erro}` });
  }
});

router.put("/update/:cpf", async (req, res) => {
  try {
    const cpflimpo = req.params.cpf.trim();
    if (cpflimpo.length !== 11) {
      return res.status(400).send({ erro: `CPF inválido` });
    }
    const usuario = await cadastro.findByPk(cpflimpo);
    if (usuario === null) {
      return res.status(404).json({ erro: `usuario não encontrado` });
    }
    await cadastro.update(
      {
        email: req.body.email,
        senha: req.body.senha,
      },
      {
        where: { cpf: req.params.cpf },
      }
    );
    return res.status(200).json({ ok: `usuario atualizado com sucesso` });
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: `erro ao atualizar usuario, erro: ${erro}` });
  }
});

module.exports = router;
