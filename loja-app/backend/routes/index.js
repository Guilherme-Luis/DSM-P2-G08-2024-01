const express = require('express');
const router = express.Router();


const UsuarioController= require('../controllers/UsuarioController')
const controllersIndex= require('../controllers/indexControllers')

router.get('/', (req, res) => res.render('home'));
router.get('/', controllersIndex.index);


module.exports = router;