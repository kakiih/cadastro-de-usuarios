const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log(`Conectado com sucesso`);
  })
  .catch((erro) => {
    console.log(`Erro ao se conectar, erro: ${erro}`);
  });

module.exports = sequelize;
