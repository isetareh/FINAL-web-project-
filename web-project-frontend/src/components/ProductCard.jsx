import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

const ProductCard = ({ product, cartQuantity = 0, onAddToCart, onViewDetails }) => {
    const navigate = useNavigate();
    
    // Construct the image URL from the backend with proper encoding
    const imageUrl = product.image 
        ? `http://localhost:5000/images/${encodeURIComponent(product.image)}`
        : 'http://localhost:5000/images/default.jpg';

    const handleViewDetails = () => {
        navigate(`/product/${product._id || product.id}`);
    };

    return (
        <motion.div 
            className="col-lg-4 col-md-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="card h-100">
                <div className="card-body text-center">
                    <div className="product-image mb-3">
                        <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="img-fluid rounded"
                            style={{ 
                                maxHeight: '200px', 
                                width: 'auto',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <i className="fas fa-mobile-alt" style={{ display: 'none', fontSize: '3rem', color: '#6c757d' }}></i>
                    </div>
                    <h5 className="card-title">{product.name}</h5>
                    <p className="price">{formatPrice(product.price)} تومان</p>
                    <p className="card-text text-muted small">
                        {product.description.substring(0, 100)}...
                    </p>
                    {cartQuantity > 0 && (
                        <p className="text-success">
                            <i className="fas fa-shopping-cart me-1"></i>
                            در سبد: {cartQuantity}
                        </p>
                    )}
                    <div className="d-grid gap-2">
                        <motion.button 
                            className="btn btn-primary" 
                            onClick={() => onAddToCart(product._id || product.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus size={16} className="me-2" />
                            افزودن به سبد
                        </motion.button>
                        <motion.button 
                            className="btn btn-outline-primary" 
                            onClick={handleViewDetails}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Eye size={16} className="me-2" />
                            مشاهده جزئیات
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard; 