const express = require("express");
const cadastro = require("../db/db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { hash } = require("bcryptjs");
const auth = require("../middleware/auth");

function limpacpf(cpf) {
  return cpf.replace(/\D/g, "");
}

router.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

router.post("/cadastro", async (req, res) => {
  try {
    const cpflimpo = limpacpf(req.body.cpf);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const email = req.body.email;
    if (cpflimpo.length !== 11) {
      return res.status(400).json({ erro: "CPF inválido!" });
    }
    if (!regex.test(email)) {
      return res.status(400).json({ erro: `email invalido.` });
    }
    const senha = req.body.senha;
    if (!senha) {
      return res
        .status(401)
        .json({ erro: "é necessário enviar a senha para cadastrar" });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    await cadastro.create({
      email: email,
      senha: senhaHash,
      cpf: cpflimpo,
    });
    return res.status(200).json({ ok: "cadastrado com sucesso" });
  } catch (erro) {
    if (erro.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ erro: `usuario ja cadastrado.` });
    } else {
      return res
        .status(500)
        .json({ erro: `erro ao cadastrar o usuario, erro: ${erro}` });
    }
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const usuarios = await cadastro.findAll();
    res.status(200).json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: `erro ao listar usuarios, erro: ${erro}` });
  }
});

router.get("/:cpf", async (req, res) => {
  try {
    const cpflimpo = limpacpf(req.params.cpf);
    if (cpflimpo.length !== 11) {
      return res.status(400).json({ erro: `CPF inválido` });
    }
    const usuario = await cadastro.findByPk(cpflimpo);
    if (usuario === null) {
      return res.status(404).json({ erro: `usuario não encontrado` });
    }
    return res.status(200).json(usuario);
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: `erro ao listar usuario, erro: ${erro}` });
  }
});

router.delete("/delete/:cpf", async (req, res) => {
  try {
    const cpflimpo = limpacpf(req.params.cpf);
    if (cpflimpo.length !== 11) {
      return res.status(400).json({ erro: `CPF inválido` });
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
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const email = req.body.email;
    const cpflimpo = limpacpf(req.params.cpf);
    if (cpflimpo.length !== 11) {
      return res.status(400).json({ erro: `CPF inválido` });
    }
    const usuario = await cadastro.findByPk(cpflimpo);
    if (usuario === null) {
      return res.status(404).json({ erro: `usuario não encontrado` });
    }
    if (!regex.test(email)) {
      return res.status(400).json({ erro: `email invalido.` });
    }
    const senha = req.body.senha;
    if (!senha) {
      return res
        .status(401)
        .json({ erro: "é necessário enviar a senha para atualizar" });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    await cadastro.update(
      {
        email: req.body.email,
        senha: senhaHash,
      },
      {
        where: { cpf: cpflimpo },
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
