const express = require('express');
const router = express.Router();

const produtoController = require('../controllers/produtoController');

router.get('/view', produtoController.view);
router.get('/', produtoController.list);
router.get('/:id', produtoController.getById); 
router.post('/', produtoController.create);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.delete);
router.delete('/', produtoController.clear);

module.exports = router;