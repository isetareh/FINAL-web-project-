const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProduct);
router.post('/', [auth, admin], productsController.addProduct);
router.put('/:id', [auth, admin], productsController.updateProduct);
router.delete('/:id', [auth, admin], productsController.deleteProduct); 

module.exports = router;