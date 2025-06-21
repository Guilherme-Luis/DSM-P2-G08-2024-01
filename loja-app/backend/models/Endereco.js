// models/Endereco.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Endereco', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rua: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: {
          tableName: 'Usuarios',
          schema: process.env.DB_SCHEMA
        },
        key: 'id'
      }
    }
  }, {
    tableName: 'enderecos',
    schema: process.env.DB_SCHEMA,
    timestamps: false
  });
};