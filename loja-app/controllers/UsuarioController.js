const Usuario = require('../models/Usuario');
const { Endereco } = require('../models');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

class UsuarioController {
  static async cadastrar(req, res) {
    console.log('Body recebido:', req.body);
    const t = await Usuario.sequelize.transaction();
    try {
      const { nome, email, senha, dataNascimento, endereco, role } = req.body;

      const existe = await Usuario.findOne({ where: { email } });
      if (existe) {
        await t.rollback();
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      // Cria o usuário
      const novoUsuario = await Usuario.create({
        id: uuidv4(),
        nome,
        email,
        senha_hash: senha, // será criptografada no hook do model
        dataNascimento,
        ativo: true,
        role: role || 'cliente'
      }, { transaction: t });

      // Cria o endereço, se enviado
      if (endereco) {
        await Endereco.create({
          ...endereco,
          id: uuidv4(),
          usuarioId: novoUsuario.id
        }, { transaction: t });
      }

      await t.commit();
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', id: novoUsuario.id });
    } catch (err) {
      await t.rollback();
      console.error(err);
      res.status(500).json({ erro: 'Erro ao cadastrar usuário.', detalhe: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // Busca o endereço do usuário
      const endereco = await Endereco.findOne({ where: { usuarioId: usuario.id } });

      // Geração de token JWT
      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        process.env.JWT_SECRET || 'segredo',
        { expiresIn: '1d' }
      );

      res.json({
        mensagem: 'Login bem-sucedido',
        usuarioId: usuario.id,
        token,
        nome: usuario.nome,
        email: usuario.email,
        endereco,
        role: usuario.role
      });
    } catch (err) {
      res.status(500).json({ erro: 'Erro no login.', detalhe: err.message });
    }
  }

  static async atualizar(req, res) {
    const t = await Usuario.sequelize.transaction();
    try {
      const { id } = req.params;
      const dados = req.body;

      const usuario = await Usuario.findByPk(id, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      // Não permitir atualização da senha diretamente aqui
      delete dados.senha;
      delete dados.senha_hash;

      // Atualiza o usuário
      await usuario.update(dados, { transaction: t });

      // Atualiza o endereço se fornecido
      if (dados.endereco) {
        const endereco = await Endereco.findOne({ where: { usuarioId: id }, transaction: t });
        if (endereco) {
          await endereco.update(dados.endereco, { transaction: t });
        } else {
          await Endereco.create({
            ...dados.endereco,
            id: uuidv4(),
            usuarioId: id
          }, { transaction: t });
        }
      }

      await t.commit();
      res.json({ mensagem: 'Usuário atualizado com sucesso.' });
    } catch (err) {
      await t.rollback();
      res.status(500).json({ erro: 'Erro ao atualizar usuário.', detalhe: err.message });
    }
  }

  static async alterarSenha(req, res) {
    const t = await Usuario.sequelize.transaction();
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      const usuario = await Usuario.findByPk(id, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha_hash);
      if (!senhaValida) {
        await t.rollback();
        return res.status(403).json({ erro: 'Senha atual incorreta.' });
      }

      usuario.senha_hash = novaSenha; // será re-hash no hook do model
      await usuario.save({ transaction: t });

      await t.commit();
      res.json({ mensagem: 'Senha alterada com sucesso.' });
    } catch (err) {
      await t.rollback();
      res.status(500).json({ erro: 'Erro ao alterar senha.', detalhe: err.message });
    }
  }

  static async desativar(req, res) {
    const t = await Usuario.sequelize.transaction();
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      usuario.ativo = false;
      await usuario.save({ transaction: t });

      await t.commit();
      res.json({ mensagem: 'Conta desativada.' });
    } catch (err) {
      await t.rollback();
      res.status(500).json({ erro: 'Erro ao desativar conta.', detalhe: err.message });
    }
  }

  static async historico(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        include: [{
          association: 'pedidos',
          include: ['itens'] // ajuste conforme suas associações
        }]
      });

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      res.json({ pedidos: usuario.pedidos });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar histórico.', detalhe: err.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [{
          model: Endereco,
          as: 'enderecos'
        }]
      });

      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      res.json(usuario);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar usuário.', detalhe: err.message });
    }
  }
}

module.exports = UsuarioController;