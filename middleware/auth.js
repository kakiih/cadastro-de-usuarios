const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ erro: "não autorizado, é necessário o envio de um token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ erro: "é necessário um token" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (erro, decoded) => {
    if (erro) {
      return res.status(401).json({ erro: "token inválido" });
    }
    req.user = decoded;
    next();
  });
}

module.exports = auth;
