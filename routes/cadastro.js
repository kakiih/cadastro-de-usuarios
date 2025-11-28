const express = require("express");
const cadastro = require("../db/db");
const router = express.Router();

router.post("/cadastro", (req, res) => {
  const cpflimpo = req.body.cpf.replace(/\./g, "").replace(/-/g, "");
  if (cpflimpo.length !== 11) {
    return res.status(400).send("CPF inválido!");
  }
  cadastro
    .create({
      email: req.body.email,
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

module.exports = router;
