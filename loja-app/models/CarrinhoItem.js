// models/CarrinhoItem.js

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CarrinhoItem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    carrinhoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: {
          tableName: 'carrinhos',
          schema: process.env.DB_SCHEMA
        },
        key: 'id'
      }
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'produtos',
          schema: process.env.DB_SCHEMA
        },
        key: 'id'
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'carrinho_itens',
    schema: process.env.DB_SCHEMA,
    timestamps: false
  });
};