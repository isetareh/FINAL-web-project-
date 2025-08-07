import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';
import { sampleProducts } from '../utils/helpers';

const ProductList = ({ currentUser, cart, onAddToCart, onViewDetails }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to sample data
            setProducts(sampleProducts);
            toast.error('خطا در بارگذاری محصولات');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!currentUser) {
            toast.error('برای افزودن به سبد خرید ابتدا وارد شوید!');
            return;
        }

        try {
            await onAddToCart(productId);
            // Don't show success toast here as it's handled in App.jsx
        } catch (error) {
            console.error('ProductList - Error adding to cart:', error);
            // Don't show error toast here as it's handled in App.jsx
        }
    };

    // Helper function to get cart quantity for a product
    const getCartQuantity = (productId) => {
        if (!cart.items) return 0;
        const cartItem = cart.items.find(item => item.productId === productId || item.product._id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    const filteredAndSortedProducts = products
        .filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    if (loading) {
        return (
            <div className="container-main text-center">
                <div className="loading"></div>
                <p className="text-white mt-3">در حال بارگذاری محصولات...</p>
            </div>
        );
    }

    return (
        <div className="container-main">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white mb-0">
                    <i className="fas fa-mobile-alt me-2"></i>محصولات
                </h2>
                {currentUser?.role === 'admin' && (
                    <motion.button 
                        className="btn btn-success" 
                        onClick={() => window.location.href = '/add-product'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={16} className="me-2" />
                        افزودن محصول
                    </motion.button>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="جستجو در محصولات..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="name">مرتب‌سازی بر اساس نام</option>
                        <option value="price-asc">قیمت: کم به زیاد</option>
                        <option value="price-desc">قیمت: زیاد به کم</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <div className="btn-group w-100">
                        <motion.button
                            className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setViewMode('grid')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Grid size={16} />
                        </motion.button>
                        <motion.button
                            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setViewMode('list')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <List size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`row ${viewMode === 'list' ? 'flex-column' : ''}`}>
                {filteredAndSortedProducts.length === 0 ? (
                    <div className="col-12 text-center text-white">
                        <i className="fas fa-search fa-3x mb-3 opacity-50"></i>
                        <h4>محصولی یافت نشد</h4>
                        <p>لطفاً عبارت جستجوی دیگری امتحان کنید</p>
                    </div>
                ) : (
                    filteredAndSortedProducts.map((product, index) => (
                        <ProductCard
                            key={product._id || product.id}
                            product={product}
                            cartQuantity={getCartQuantity(product._id || product.id)}
                            onAddToCart={handleAddToCart}
                            onViewDetails={onViewDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductList; 