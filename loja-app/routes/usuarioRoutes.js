const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.post('/', UsuarioController.cadastrar);        
router.post('/login', UsuarioController.login);       
router.put('/atualizar/:id', UsuarioController.atualizar);       
router.put('/alterar-senha/:id', UsuarioController.alterarSenha); 
router.delete('/desativar/:id', UsuarioController.desativar);    
router.get('/historico/:id', UsuarioController.historico);       
router.get('/:id', UsuarioController.buscarPorId); // <-- nova rota adicionada

module.exports = router;