import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductDetails = ({ currentUser, onAddToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getById(id);
            setProduct(response.data);
        } catch (error) {
            console.error('Error loading product:', error);
            toast.error('خطا در بارگذاری محصول');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!currentUser) {
            toast.error('برای افزودن به سبد خرید ابتدا وارد شوید!');
            return;
        }

        try {
            // Call the onAddToCart function from App.jsx which handles the cart API
            await onAddToCart(product._id);
            toast.success(`${quantity} عدد ${product.name} به سبد خرید اضافه شد!`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('خطا در افزودن به سبد خرید');
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="container-main text-center">
                <div className="loading"></div>
                <p className="text-white mt-3">در حال بارگذاری محصول...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-main text-center">
                <p className="text-white">محصول یافت نشد!</p>
                <motion.button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    بازگشت به صفحه اصلی
                </motion.button>
            </div>
        );
    }

    // Construct the image URL from the backend with proper encoding
    const imageUrl = product.image 
        ? `http://localhost:5000/images/${encodeURIComponent(product.image)}`
        : '/default-product.jpg';

    return (
        <div className="container-main">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Back Button */}
                <motion.button 
                    className="btn btn-outline-light mb-4"
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeft size={16} className="me-2" />
                    بازگشت
                </motion.button>

                <div className="row">
                    {/* Product Image */}
                    <div className="col-lg-6 mb-4">
                        <div className="card">
                            <div className="card-body text-center">
                                <img 
                                    src={imageUrl} 
                                    alt={product.name}
                                    className="img-fluid rounded"
                                    style={{ 
                                        maxHeight: '400px', 
                                        width: 'auto',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <i className="fas fa-mobile-alt" style={{ display: 'none', fontSize: '8rem', color: '#6c757d' }}></i>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-white mb-3">{product.name}</h2>
                                
                                <div className="price-display mb-4">
                                    <h3 className="text-primary">{formatPrice(product.price)} تومان</h3>
                                </div>

                                <div className="description mb-4">
                                    <h5 className="text-white mb-2">توضیحات محصول:</h5>
                                    <p className="text-light">{product.description}</p>
                                </div>

                                {/* Quantity Selector */}
                                <div className="quantity-selector mb-4">
                                    <h5 className="text-white mb-2">تعداد:</h5>
                                    <div className="d-flex align-items-center">
                                        <motion.button 
                                            className="btn btn-outline-primary me-2"
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Minus size={16} />
                                        </motion.button>
                                        
                                        <span className="mx-3 text-white" style={{ fontSize: '1.2rem', minWidth: '50px', textAlign: 'center' }}>
                                            {quantity}
                                        </span>
                                        
                                        <motion.button 
                                            className="btn btn-outline-primary ms-2"
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Plus size={16} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <motion.button 
                                    className="btn btn-primary btn-lg w-100 mb-3"
                                    onClick={handleAddToCart}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ShoppingCart size={20} className="me-2" />
                                    افزودن به سبد خرید
                                </motion.button>

                                {/* Product Features */}
                                <div className="product-features mt-4">
                                    <h5 className="text-white mb-3">ویژگی‌های کلیدی:</h5>
                                    <ul className="text-light">
                                        <li>✅ گارانتی معتبر</li>
                                        <li>✅ ارسال رایگان</li>
                                        <li>✅ پشتیبانی 24/7</li>
                                        <li>✅ بازگشت 7 روزه</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductDetails; 