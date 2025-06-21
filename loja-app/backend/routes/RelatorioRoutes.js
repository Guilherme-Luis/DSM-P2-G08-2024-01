const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/RelatorioController');

router.get('/', relatorioController.relatorioVendas);
router.get('/pedidos-por-status', relatorioController.pedidosPorStatus);
router.get('/estoque', relatorioController.estoqueProdutos);

module.exports = router;
