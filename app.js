const express = require("express");
const sequelize = require("./db/connect");
const cadastro = require("./db/db");
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.listen(PORT, () => {
  console.log(`servidor rodando em: http://localhost:${PORT}`);
});

const router = require("./routes/cadastro");
app.use("/user", router);

const routeLogin = require("./routes/login");
app.use("/log", routeLogin);
