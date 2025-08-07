const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const auth = require('../middleware/auth');

// Cart routes that match frontend API calls
router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.put('/:productId', auth, cartController.updateCartItem);
router.delete('/:productId', auth, cartController.removeFromCart);
router.delete('/', auth, cartController.clearCart);
router.post('/cleanup', auth, cartController.cleanupCart);

module.exports = router;