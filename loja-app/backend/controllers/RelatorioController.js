const { Pedido, ItemPedido, Produto } = require('../models');
const { Op } = require('sequelize');

const relatorioController = {};

// RELATÓRIO DE VENDAS
relatorioController.relatorioVendas = async (req, res) => {
  try {
    const filtro = req.query.filtro || 'mensal';
    const hoje = new Date();
    let dataInicio;
    let dataFim = new Date();

    switch (filtro) {
      case 'diario':
        dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
        break;
      case 'semanal':
        dataInicio = new Date(hoje);
        dataInicio.setDate(hoje.getDate() - 7);
        break;
      case 'mensal':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
      case 'anual':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    }

    const pedidos = await Pedido.findAll({
      where: {
        createdAt: {
          [Op.between]: [dataInicio, dataFim]
        }
      },
      include: [
        {
          model: ItemPedido,
          as: 'itens',
          include: [
            {
              model: Produto,
              as: 'produto',
              attributes: ['id', 'nome']
            }
          ]
        }
      ]
    });

    let totalVendido = 0;
    const produtosMap = {};
    const vendasPorCanal = {};

    pedidos.forEach((pedido) => {
      totalVendido += Number(pedido.total);

      const canal = pedido.metodoPagamento || 'outros';
      vendasPorCanal[canal] = (vendasPorCanal[canal] || 0) + Number(pedido.total);

      pedido.itens.forEach((item) => {
        const pid = item.produto.id;
        const nome = item.produto.nome;
        const qtd = item.quantidade;

        if (!produtosMap[pid]) {
          produtosMap[pid] = { nome, quantidade: 0 };
        }
        produtosMap[pid].quantidade += qtd;
      });
    });

    const produtosMaisVendidos = Object.values(produtosMap).sort((a, b) => b.quantidade - a.quantidade);
    const vendasPorCanalArray = Object.entries(vendasPorCanal).map(([canal, valor]) => ({ canal, valor }));

    res.json({
      total: totalVendido,
      produtosMaisVendidos,
      vendasPorCanal: vendasPorCanalArray
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    res.status(500).json({ mensagem: 'Erro ao gerar relatório de vendas' });
  }
};

// RELATÓRIO DE PEDIDOS POR STATUS
relatorioController.pedidosPorStatus = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({ attributes: ['status'] });

    const contagem = {
      pendente: 0,
      em_separacao: 0,
      finalizado: 0,
      outros: 0
    };

    pedidos.forEach(pedido => {
      const status = pedido.status;
      if (contagem[status] !== undefined) {
        contagem[status]++;
      } else {
        contagem.outros++;
      }
    });

    res.json([
      { status: 'pendente', quantidade: contagem.pendente },
      { status: 'em_separacao', quantidade: contagem.em_separacao },
      { status: 'finalizado', quantidade: contagem.finalizado },
      { status: 'outros', quantidade: contagem.outros }
    ]);
  } catch (error) {
    console.error('Erro ao contar pedidos por status:', error);
    res.status(500).json({ mensagem: 'Erro ao contar pedidos por status' });
  }
};

// RELATÓRIO DE ESTOQUE DOS PRODUTOS
relatorioController.estoqueProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      attributes: ['id', 'nome', 'categoria', 'quantidade', 'ativo', 'img']
    });

    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar estoque' });
  }
};

module.exports = relatorioController;
