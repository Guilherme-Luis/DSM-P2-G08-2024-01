const Carrinho = require('../models/Carrinho');
const CarrinhoItem = require('../models/CarrinhoItem');
const Produto = require('../models/Produto');
const { v4: uuidv4 } = require('uuid');

const encontrarOuCriarCarrinho = async (usuarioId) => {
  let carrinho = await Carrinho.findOne({ where: { usuarioId } });
  if (!carrinho) {
    carrinho = await Carrinho.create({ id: uuidv4(), usuarioId });
  }
  return carrinho;
};

const adicionarProduto = async (req, res) => {
  const usuarioId = req.body.usuarioId;
  const { produtoId, quantidade } = req.body;

  if (!usuarioId || !produtoId || !quantidade) {
    return res.status(400).json({ mensagem: "Campos obrigatórios faltando." });
  }

  const produto = await Produto.findByPk(produtoId);
  if (!produto) return res.status(404).json({ mensagem: "Produto não encontrado." });

  const carrinho = await encontrarOuCriarCarrinho(usuarioId);

  let item = await CarrinhoItem.findOne({ where: { carrinhoId: carrinho.id, produtoId } });
  if (item) {
    item.quantidade += quantidade;
    await item.save();
  } else {
    await CarrinhoItem.create({
      carrinhoId: carrinho.id,
      produtoId,
      quantidade
    });
  }

  res.status(201).json({ mensagem: "Produto adicionado ao carrinho." });
};

const listarCarrinho = async (req, res) => {
  try {
    // Verifica se usuarioId foi fornecido e é válido
    const usuarioId = req.params.usuarioId;
    
    if (!usuarioId || usuarioId === 'null' || usuarioId === 'undefined') {
      return res.json({ itens: [], total: 0 });
    }

    const carrinho = await Carrinho.findOne({ 
      where: { usuarioId },
      include: [{
        model: CarrinhoItem,
        include: [Produto]
      }]
    });

    if (!carrinho) {
      return res.json({ itens: [], total: 0 });
    }

    // Calcula o total
    const total = carrinho.CarrinhoItems.reduce((sum, item) => {
      return sum + (item.quantidade * item.Produto.preco);
    }, 0);

    res.json({
      itens: carrinho.CarrinhoItems,
      total
    });
  } catch (error) {
    console.error('Erro ao listar carrinho:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const removerProduto = async (req, res) => {
  const { usuarioId, produtoId } = req.body;

  const carrinho = await Carrinho.findOne({ where: { usuarioId } });
  if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado." });

  await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id, produtoId } });

  res.json({ mensagem: "Produto removido do carrinho." });
};

const atualizarQuantidade = async (req, res) => {
  const { usuarioId, produtoId, quantidade } = req.body;

  const carrinho = await Carrinho.findOne({ where: { usuarioId } });
  if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado." });

  const item = await CarrinhoItem.findOne({ where: { carrinhoId: carrinho.id, produtoId } });
  if (!item) return res.status(404).json({ mensagem: "Produto não está no carrinho." });

  item.quantidade = quantidade;
  await item.save();

  res.json({ mensagem: "Quantidade atualizada." });
};

const limparCarrinho = async (req, res) => {
  const { usuarioId } = req.body;

  const carrinho = await Carrinho.findOne({ where: { usuarioId } });
  if (!carrinho) return res.status(404).json({ mensagem: "Carrinho não encontrado." });

  await CarrinhoItem.destroy({ where: { carrinhoId: carrinho.id } });

  res.json({ mensagem: "Carrinho esvaziado." });
};

module.exports = {
  adicionarProduto,
  listarCarrinho,
  removerProduto,
  atualizarQuantidade,
  limparCarrinho
};
