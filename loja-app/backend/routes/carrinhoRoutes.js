const express = require('express');
const router = express.Router();
const CarrinhoController = require('../controllers/CarrinhoController');


router.post('/adicionar', CarrinhoController.adicionarProduto);
router.get('/:usuarioId', CarrinhoController.listarCarrinho);
router.post('/remover', CarrinhoController.removerProduto);
router.post('/atualizar', CarrinhoController.atualizarQuantidade);
router.post('/limpar', CarrinhoController.limparCarrinho);


module.exports = router;
