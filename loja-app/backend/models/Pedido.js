// models/Pedido.js
module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    enderecoId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pendente'
    },
    metodoPagamento: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    schema: process.env.DB_SCHEMA
  });

  Pedido.associate = function(models) {
    Pedido.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Pedido.belongsTo(models.Endereco, { foreignKey: 'enderecoId', as: 'endereco' });
    Pedido.hasMany(models.ItemPedido, { foreignKey: 'pedidoId', as: 'itens' });
  };

  return Pedido;
};
