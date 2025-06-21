const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/connection');
const bcrypt = require('bcrypt'); // <--- Importação do bcrypt adicionada
const Carrinho = require('./Carrinho');
const CarrinhoItem = require('./CarrinhoItem');

class UsuarioModel extends Model {
  async autenticar(senha) {
    return await bcrypt.compare(senha, this.senha_hash);
  }
}

UsuarioModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  nome: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  senha_hash: DataTypes.STRING,
  dataNascimento: DataTypes.DATEONLY,
  endereco: DataTypes.STRING,
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  sequelize,
  modelName: 'Usuario',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha_hash) {
        usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha_hash')) {
        usuario.senha_hash = await bcrypt.hash(usuario.senha_hash, 10);
      }
    }
  }
});

module.exports = UsuarioModel;