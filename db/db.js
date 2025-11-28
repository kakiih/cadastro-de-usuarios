const sequelize = require("./connect");
const { DataTypes } = require("sequelize");

const cadastro = sequelize.define("cadastro", {
  cpf: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// cadastro.sync({ force: true });

module.exports = cadastro;
