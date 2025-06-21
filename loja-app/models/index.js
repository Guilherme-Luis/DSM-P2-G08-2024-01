// models/index.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');

// 1) Instanciação dos modelos via factories
const Usuario = require('./Usuario');
const Produto       = require('./Produto')(sequelize, DataTypes);
const Carrinho      = require('./Carrinho')(sequelize, DataTypes);
const CarrinhoItem  = require('./CarrinhoItem')(sequelize, DataTypes);
const Endereco      = require('./Endereco')(sequelize, DataTypes);
const ItemPedido    = require('./ItemPedido')(sequelize, DataTypes);
const Pedido      = require('./Pedido')(sequelize, DataTypes);

// 2) Configuração das associações entre os modelos
function setupAssociations() {
  // Usuário ↔ Carrinho
  Usuario.hasMany(Carrinho, {
    foreignKey: 'usuarioId',
    as: 'carrinhos',
    schema: process.env.DB_SCHEMA
  });
  Carrinho.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    schema: process.env.DB_SCHEMA
  });

  // Carrinho ↔ CarrinhoItem
  Carrinho.hasMany(CarrinhoItem, {
    foreignKey: 'carrinhoId',
    as: 'itens',
    schema: process.env.DB_SCHEMA
  });
  CarrinhoItem.belongsTo(Carrinho, {
    foreignKey: 'carrinhoId',
    schema: process.env.DB_SCHEMA
  });

  // Produto ↔ CarrinhoItem
  Produto.hasMany(CarrinhoItem, {
    foreignKey: 'produtoId',
    schema: process.env.DB_SCHEMA
  });
  CarrinhoItem.belongsTo(Produto, {
    foreignKey: 'produtoId',
    schema: process.env.DB_SCHEMA
  });

  // Usuário ↔ Endereço
  Usuario.hasMany(Endereco, {
    foreignKey: 'usuarioId',
    as: 'enderecos',
    schema: process.env.DB_SCHEMA
  });
  Endereco.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    schema: process.env.DB_SCHEMA
  });
  
  // Associar Pedido com seus relacionamentos
  Usuario.hasMany(Pedido, {
    foreignKey: 'usuarioId',
    as: 'pedidos',
    schema: process.env.DB_SCHEMA
  });
  Pedido.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
    schema: process.env.DB_SCHEMA
  });

  Endereco.hasMany(Pedido, {
    foreignKey: 'enderecoId',
    as: 'pedidos',
    schema: process.env.DB_SCHEMA
  });
  Pedido.belongsTo(Endereco, {
    foreignKey: 'enderecoId',
    as: 'endereco',
    schema: process.env.DB_SCHEMA
  });

  Pedido.hasMany(ItemPedido, {
    foreignKey: 'pedidoId',
    as: 'itens',
    schema: process.env.DB_SCHEMA
  });
  ItemPedido.belongsTo(Pedido, {
    foreignKey: 'pedidoId',
    as: 'pedido',
    schema: process.env.DB_SCHEMA
  });

  ItemPedido.belongsTo(Produto, {
    foreignKey: 'produtoId',
    as: 'produto',
    schema: process.env.DB_SCHEMA
  });
  Produto.hasMany(ItemPedido, {
    foreignKey: 'produtoId',
    as: 'itensPedido',
    schema: process.env.DB_SCHEMA
  });


  // CarrinhoItem ↔ ItemPedido (se fizer sentido ligar)
  // ou Produto ↔ ItemPedido, conforme seu modelo de dominio.
  // Se ItemPedido representa itens de um pedido diferente, associe:
  // Pedido.hasMany(ItemPedido, { foreignKey: 'pedidoId', schema: process.env.DB_SCHEMA });
  // ItemPedido.belongsTo(Pedido, { foreignKey: 'pedidoId', schema: process.env.DB_SCHEMA });
}

// 3) Exportação
module.exports = {
  sequelize,
  setupAssociations,
  Usuario,
  Produto,
  Carrinho,
  CarrinhoItem,
  Endereco,
  ItemPedido,
  Pedido
};