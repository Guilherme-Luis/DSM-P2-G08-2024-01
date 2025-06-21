const { Pedido, ItemPedido, sequelize } = require('../models');

module.exports = {
    // Listar todos os pedidos com relacionamentos
    async listar(req, res) {
        try {
            const pedidos = await Pedido.findAll({
                include: [
                    { association: 'usuario' },
                    { association: 'endereco' },
                    { association: 'itens' }
                ]
            });
            res.json(pedidos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar pedidos.' });
        }
    },

    // Buscar pedido por ID com relacionamentos
    async buscarPorId(req, res) {
        try {
            const pedido = await Pedido.findByPk(req.params.id, {
                include: [
                    { association: 'usuario' },
                    { association: 'endereco' },
                    { association: 'itens' }
                ]
            });
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }
            res.json(pedido);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar pedido.' });
        }
    },

    // Criar novo pedido
    async criar(req, res) {
    console.log('Body recebido:', req.body);
    const { usuarioId, enderecoId, total, status, metodoPagamento, itens } = req.body;
    const t = await sequelize.transaction();
    try {
        const novoPedido = await Pedido.create(
        { usuarioId, enderecoId, total, status, metodoPagamento },
        { transaction: t }
        );

        if (Array.isArray(itens) && itens.length > 0) {
        for (const item of itens) {
            await ItemPedido.create(
            {
                ...item,
                pedidoId: novoPedido.id // associa ao pedido criado
            },
            { transaction: t }
            );
        }
        }

        await t.commit();
        res.status(201).json({ pedido: novoPedido });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar pedido.' });
    }
    },

    // Atualizar pedido
    async atualizar(req, res) {
        try {
            const pedido = await Pedido.findByPk(req.params.id);
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }
            await pedido.update(req.body);
            res.json(pedido);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar pedido.' });
        }
    },

    // Deletar pedido
    async deletar(req, res) {
        try {
            const pedido = await Pedido.findByPk(req.params.id);
            if (!pedido) {
                return res.status(404).json({ error: 'Pedido não encontrado.' });
            }
            await pedido.destroy();
            res.json({ mensagem: 'Pedido deletado com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar pedido.' });
        }
    }
};
