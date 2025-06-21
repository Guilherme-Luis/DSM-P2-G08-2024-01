// models/Produto.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Produto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'produtos',
    schema: process.env.DB_SCHEMA,
    timestamps: false
  });
};