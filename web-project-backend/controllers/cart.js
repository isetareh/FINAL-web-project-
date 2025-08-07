const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    
    // Recalculate total with populated data, filtering out null products
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const validItems = populatedCart.items.filter(item => item.product !== null);
    populatedCart.total = validItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    await populatedCart.save();
    
    // Transform the data to match frontend expectations
    const transformedCart = {
      items: populatedCart.items.map(item => ({
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      })),
      total: populatedCart.total
    };
    
    res.json(transformedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) return res.json({ items: [], total: 0 });
    
    // Filter out items with null products and transform the data
    const validItems = cart.items.filter(item => item.product !== null);
    
    // If there are invalid items, clean up the cart
    if (validItems.length !== cart.items.length) {
      console.log('Cart controller - Cleaning up invalid cart items');
      cart.items = validItems;
      await cart.save();
    }
    
    const transformedCart = {
      items: validItems.map(item => ({
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      })),
      total: validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    };
    
    res.json(transformedCart);
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate total
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const validItems = populatedCart.items.filter(item => item.product !== null);
    cart.total = validItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

    await cart.save();
    
    // Return populated cart
    const finalCart = await Cart.findById(cart._id).populate('items.product');
    const finalValidItems = finalCart.items.filter(item => item.product !== null);
    const transformedCart = {
      items: finalValidItems.map(item => ({
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      })),
      total: finalCart.total
    };
    
    res.json(transformedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

// Update product quantity in cart
exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user.id;

  if (!productId || quantity === undefined || quantity < 1) {
    return res.status(400).json({ 
      error: 'Product ID and valid quantity (>=1) are required' 
    });
  }

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;

    // Recalculate total
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    const validItems = populatedCart.items.filter(item => item.product !== null);
    cart.total = validItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );

    await cart.save();
    
    // Return populated cart
    const finalCart = await Cart.findById(cart._id).populate('items.product');
    const finalValidItems = finalCart.items.filter(item => item.product !== null);
    const transformedCart = {
      items: finalValidItems.map(item => ({
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      })),
      total: finalCart.total
    };
    
    res.json(transformedCart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    cart.total = 0;
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', items: [], total: 0 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

// Clean up invalid cart items (utility function)
exports.cleanupCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.json({ message: 'No cart found', items: [], total: 0 });

    // Filter out items with null products
    const validItems = cart.items.filter(item => item.product !== null);
    
    if (validItems.length !== cart.items.length) {
      console.log(`Cleaning up cart: removed ${cart.items.length - validItems.length} invalid items`);
      cart.items = validItems;
      cart.total = validItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      await cart.save();
    }

    const transformedCart = {
      items: validItems.map(item => ({
        productId: item.product._id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      })),
      total: cart.total
    };

    res.json({ message: 'Cart cleaned up successfully', ...transformedCart });
  } catch (error) {
    console.error('Error cleaning up cart:', error);
    res.status(500).json({ error: 'Failed to clean up cart' });
  }
};