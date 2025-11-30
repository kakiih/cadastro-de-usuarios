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

router.get("/", (req, res) => {
  cadastro
    .findAll()
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((erro) => {
      res.send(`Erro ao listar usuarios, erro: ${erro}`);
    });
});

router.get("/:cpf", (req, res) => {
  cadastro
    .findByPk(req.params.cpf)
    .then((usuarios) => {
      if (usuarios == null) {
        return res.status(400).json(`Usuario não encontrado.`);
      } else {
        res.json(usuarios);
      }
    })
    .catch((erro) => {
      res.send(`Erro ao listar o usuario, erro: ${erro}`);
    });
});

router.delete("/delete/:cpf", (req, res) => {
  cadastro
    .destroy({ where: { cpf: req.params.cpf } })
    .then(() => {
      res.status(200).send("sucesso ao deletar usuario.");
    })
    .catch((erro) => {
      res.status(500).send(`erro ao deletar usuario, erro: ${erro}`);
    });
});

router.put("/update/:cpf", (req, res) => {
  cadastro
    .update(
      {
        email: req.body.email,
        senha: req.body.senha,
      },
      {
        where: { cpf: req.params.cpf },
      }
    )
    .then(() => {
      res.status(200).send(`usuario atualizado com sucesso.`);
    })
    .catch((erro) => {
      return res.status(500).send(`erro ao atualizar o usuario, erro: ${erro}`);
    });
});

module.exports = router;
