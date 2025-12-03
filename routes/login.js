const express = require("express");
const cadastro = require("../db/db");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: `envie o email e a senha` });
  }
  const user = await cadastro.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ erro: `usuario não encontrado` });
  }
  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) {
    return res.status(401).json({ erro: `senha incorreta` });
  }
  const token = jwt.sign(
    {
      cpf: user.cpf,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return res.status(200).json({
    mensagem: "Login realizado com sucesso",
    token: token,
  });
});

module.exports = router;
