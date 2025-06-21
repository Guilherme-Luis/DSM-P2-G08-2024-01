// models/Carrinho.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Carrinho', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'carrinhos',
    schema: process.env.DB_SCHEMA,
    timestamps: false
  });
};