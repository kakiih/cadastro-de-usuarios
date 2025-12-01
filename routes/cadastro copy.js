const express = require("express");
const cadastro = require("../db/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const usuarios = await cadastro.findAll();
    res.status(200).json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: `ao listar usuarios, erro: ${erro}` });
  }
});

module.exports = router;
