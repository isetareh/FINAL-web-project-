import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Cart = ({ currentUser, cart, onUpdateCart }) => {
    const navigate = useNavigate();
    const updateQuantity = async (productId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                await cartAPI.removeFromCart(productId);
            } else {
                await cartAPI.updateQuantity(productId, newQuantity);
            }
            await onUpdateCart();
            toast.success('سبد خرید به‌روزرسانی شد');
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('خطا در به‌روزرسانی سبد خرید');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await cartAPI.removeFromCart(productId);
            await onUpdateCart();
            toast.success('محصول از سبد خرید حذف شد');
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('خطا در حذف محصول');
        }
    };

    const calculateTotal = () => {
        if (!cart.items) return 0;
        return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (!currentUser) {
        return (
            <div className="container-main text-center">
                <i className="fas fa-user-lock fa-3x mb-3 text-white-50"></i>
                <h4 className="text-white">برای مشاهده سبد خرید ابتدا وارد شوید</h4>
                <p className="text-white-50">لطفاً وارد حساب کاربری خود شوید</p>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="container-main">
                <h2 className="text-white mb-4">
                    <ShoppingCart size={24} className="me-2" />
                    سبد خرید
                </h2>
                <div className="text-center text-white">
                    <i className="fas fa-shopping-cart fa-3x mb-3 opacity-50"></i>
                    <h4>سبد خرید شما خالی است</h4>
                    <p>محصولی برای نمایش وجود ندارد</p>
                    <motion.button 
                        className="btn btn-primary btn-lg mt-3"
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <i className="fas fa-arrow-right me-2"></i>ادامه خرید
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-main">
            <h2 className="text-white mb-4">
                <ShoppingCart size={24} className="me-2" />
                سبد خرید
            </h2>
            
            {cart.items.map((item) => (
                <motion.div 
                    key={item.productId || item.product._id} 
                    className="card mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-2">
                                <div className="product-image" style={{ height: '80px' }}>
                                    <img 
                                        src={`http://localhost:5000/images/${encodeURIComponent(item.product?.image || item.image || 'default.jpg')}`}
                                        alt={item.name || item.product?.name}
                                        className="img-fluid rounded"
                                        style={{ 
                                            maxHeight: '80px', 
                                            width: 'auto',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <i className="fas fa-mobile-alt" style={{ display: 'none', fontSize: '2rem', color: '#6c757d' }}></i>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <h6 className="mb-1">{item.name || item.product.name}</h6>
                                <small className="text-muted">{formatPrice(item.price || item.product.price)} تومان</small>
                            </div>
                            <div className="col-md-3">
                                <div className="quantity-control">
                                    <motion.button 
                                        className="quantity-btn" 
                                        onClick={() => updateQuantity(item.productId || item.product._id, item.quantity - 1)}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Minus size={16} />
                                    </motion.button>
                                    <span className="mx-2 fw-bold">{item.quantity}</span>
                                    <motion.button 
                                        className="quantity-btn" 
                                        onClick={() => updateQuantity(item.productId || item.product._id, item.quantity + 1)}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Plus size={16} />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="price">{formatPrice((item.price || item.product.price) * item.quantity)} تومان</div>
                            </div>
                            <div className="col-md-1">
                                <motion.button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => removeFromCart(item.productId || item.product._id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Trash2 size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
            
            <motion.div 
                className="card bg-primary text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h5 className="mb-0">مجموع کل:</h5>
                        </div>
                        <div className="col-md-4 text-end">
                            <h4 className="mb-0">{formatPrice(calculateTotal())} تومان</h4>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            <div className="text-center mt-4">
                <motion.button 
                    className="btn btn-primary btn-lg me-3"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-arrow-right me-2"></i>ادامه خرید
                </motion.button>
                <motion.button 
                    className="btn btn-success btn-lg"
                    onClick={() => toast.success('سفارش شما با موفقیت ثبت شد!')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-check me-2"></i>تکمیل خرید
                </motion.button>
            </div>
        </div>
    );
};

export default Cart; 