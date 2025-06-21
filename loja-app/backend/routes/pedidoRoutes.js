const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');

// Listar todos os pedidos
router.get('/', PedidoController.listar);
// Buscar pedido por ID
router.get('/:id', PedidoController.buscarPorId);
// Criar novo pedido
router.post('/', PedidoController.criar);
// Atualizar pedido
router.put('/:id', PedidoController.atualizar);
// Deletar pedido
router.delete('/:id', PedidoController.deletar);

module.exports = router;
