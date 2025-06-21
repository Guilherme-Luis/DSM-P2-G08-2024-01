const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, setupAssociations } = require('./models'); // Modificado para importar do models/index.js

const app = express();
const PORT = 8000;

// Configuração do banco de dados e associações
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco estabelecida.');
    
    setupAssociations(); // Configura todas as associações entre modelos
    
    // Sincroniza os modelos com o banco (use { force: true } apenas em desenvolvimento inicial)

    //await sequelize.sync({ alter: true });
    await sequelize.sync(); // sem "alter"

    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Falha na inicialização do banco:', error);
    process.exit(1);
  }
}

// Middlewares
app.use(cors({ 
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do EJS (se estiver usando)
app.set('view engine', 'ejs');
app.set('views', './views');

/*
 * Rotas da API
 */
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const produtoRoutes = require('./routes/produtosRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const itemPedidoRoutes = require('./routes/itemPedidoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const routes = require('./routes');

// Prefixo '/api' para todas as rotas
app.use('/api/carrinho', carrinhoRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/usuarios', usuarioRoutes); // Sugiro usar plural para consistência
app.use('/api/itens-pedido', itemPedidoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api', routes);

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();