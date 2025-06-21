// models/ItemPedido.js
module.exports = (sequelize, DataTypes) => {
  const ItemPedido = sequelize.define('ItemPedido', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    precoUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    precoTotal: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.get('quantidade') * this.get('precoUnitario');
      }
    }
  }, {
    tableName: 'itens_pedido',
    schema: process.env.DB_SCHEMA,
    timestamps: false
  });

  ItemPedido.associate = (models) => {
    ItemPedido.belongsTo(models.Pedido, {
      foreignKey: 'pedidoId',
      as: 'pedido'
    });
    ItemPedido.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
  };

  return ItemPedido;
};
