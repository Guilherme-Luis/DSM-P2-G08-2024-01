const ItemPedido = require('../models/ItemPedido');

// Banco de dados em memória
let itensPedido = [];

const encontrarItemPorId = (id) => itensPedido.find(item => item.id == id);

const ItemPedidoController = {
  adicionar(req, res) {
    const { id, nome, quantidade, precoUnitario } = req.body;

    if (!id || !nome || !quantidade || !precoUnitario) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: id, nome, quantidade, precoUnitario.' });
    }

    const quantidadeNum = parseInt(quantidade);
    const precoNum = parseFloat(precoUnitario);

    if (isNaN(quantidadeNum) || isNaN(precoNum) || quantidadeNum <= 0 || precoNum <= 0) {
      return res.status(400).json({ error: 'Quantidade e preço devem ser números positivos.' });
    }

    const existente = encontrarItemPorId(id);

    if (existente) {
      existente.atualizarQuantidade(existente.quantidade + quantidadeNum);
      return res.status(200).json(existente.toJSON());
    }

    const novoItem = new ItemPedido(id, nome, quantidadeNum, precoNum);
    itensPedido.push(novoItem);
    res.status(201).json(novoItem.toJSON());
  },

  atualizarQuantidade(req, res) {
    const { id } = req.params;
    const { quantidade } = req.body;

    const novaQtd = parseInt(quantidade);

    if (isNaN(novaQtd) || novaQtd <= 0) {
      return res.status(400).json({ error: 'A quantidade deve ser um número positivo.' });
    }

    const item = encontrarItemPorId(id);

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    item.atualizarQuantidade(novaQtd);
    res.status(200).json(item.toJSON());
  },

  listar(req, res) {
    const lista = itensPedido.map(item => item.toJSON());
    res.status(200).json(lista);
  },

  remover(req, res) {
    const { id } = req.params;
    const index = itensPedido.findIndex(item => item.id == id);

    if (index === -1) {
      return res.status(404).json({ error: 'Item não encontrado.' });
    }

    const removido = itensPedido.splice(index, 1);
    res.status(200).json({ mensagem: 'Item removido com sucesso.', item: removido[0].toJSON() });
  },

  limpar(req, res) {
    itensPedido = [];
    res.status(200).json({ mensagem: 'Todos os itens foram removidos do pedido.' });
  },

  calcularTotal(req, res) {
    const total = itensPedido.reduce((soma, item) => soma + item.precoTotal, 0);
    res.status(200).json({ total: total.toFixed(2), moeda: 'BRL' });
  }
};

module.exports = ItemPedidoController;
