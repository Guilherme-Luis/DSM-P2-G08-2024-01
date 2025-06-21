const express = require('express');
const router = express.Router();
const ItemPedidoController = require('../controllers/ItemPedidoController');


router.post('/adicionar', ItemPedidoController.adicionar);
router.put('/atualizar/:id', ItemPedidoController.atualizarQuantidade);
router.get('/listar', ItemPedidoController.listar);
router.delete('/remover/:id', ItemPedidoController.remover);
router.delete('/limpar', ItemPedidoController.limpar);

module.exports = router;