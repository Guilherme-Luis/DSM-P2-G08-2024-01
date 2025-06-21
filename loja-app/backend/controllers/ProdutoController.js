const { Produto } = require('../models');

const controller = {};

// Renderizar a tela de produtos
controller.view = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.render('produtos', { produtos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar produtos');
  }
};

// Criar produto
controller.create = async (req, res) => {
  try {
    console.log('Requisição para criar produto:', req.body);
    const { nome, preco, descricao, img, categoria, ativo } = req.body;
    const produto = await Produto.create({ nome, preco, descricao, img, categoria, ativo });
    console.log('Produto criado com sucesso:', produto);
    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).end();
  }
};

// Atualizar produto pelo id
controller.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, preco, descricao, img, categoria, ativo } = req.body;
    const [updated] = await Produto.update(
      { nome, preco, descricao, img, categoria, ativo },
      { where: { id } }
    );
    if (updated === 0) return res.status(404).end();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Deletar produto pelo id
controller.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Produto.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).end();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Listar todos os produtos (JSON)
controller.list = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    console.log('Acessando lista de produtos');
    res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Obter um produto pelo id
controller.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ mensagem: 'Erro interno ao buscar produto.' });
  }
};

// Limpar todos os produtos
controller.clear = async (req, res) => {
  try {
    await Produto.destroy({ where: {} });
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

module.exports = controller;
