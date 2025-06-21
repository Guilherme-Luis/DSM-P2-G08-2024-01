require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    schema: process.env.DB_SCHEMA || 'public',
    logging: false
  }
);

console.log('Iniciando conexão...');
sequelize.authenticate()
  .then(() => console.log('🟢 Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('🔴 Erro ao conectar:', err));

module.exports = sequelize;