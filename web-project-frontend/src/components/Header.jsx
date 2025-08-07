import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, LogOut, LogIn, UserPlus, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const Header = ({ currentUser, cartCount, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            onLogout();
            toast.success('با موفقیت خارج شدید!');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout locally even if API fails
            onLogout();
            toast.success('با موفقیت خارج شدید!');
            navigate('/');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="container">
                <motion.a 
                    className="navbar-brand fw-bold text-primary" 
                    href="#" 
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-mobile-alt me-2"></i>فروشگاه موبایل
                </motion.a>
                
                <div className="navbar-nav ms-auto d-flex flex-row gap-3">
                    {currentUser ? (
                        <div className="d-flex align-items-center gap-3">
                            <span className="user-info">
                                <i className="fas fa-user me-1"></i>
                                {currentUser.username}
                                <span className="badge bg-success ms-2">
                                    {currentUser.isAdmin ? 'مدیر' : 'کاربر'}
                                </span>
                            </span>
                            {currentUser.isAdmin && (
                                <motion.button 
                                    className="btn btn-warning btn-sm" 
                                    onClick={() => navigate('/admin')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Crown size={16} className="me-1" />
                                    پنل ادمین
                                </motion.button>
                            )}
                            <motion.button 
                                className="btn btn-outline-danger btn-sm" 
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogOut size={16} className="me-1" />
                                خروج
                            </motion.button>
                        </div>
                    ) : (
                        <div className="d-flex gap-2">
                            <motion.button 
                                className="btn btn-outline-primary btn-sm" 
                                onClick={() => navigate('/login')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogIn size={16} className="me-1" />
                                ورود
                            </motion.button>
                            <motion.button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => navigate('/register')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <UserPlus size={16} className="me-1" />
                                ثبت نام
                            </motion.button>
                        </div>
                    )}
                    
                    <motion.button 
                        className="btn btn-outline-success position-relative" 
                        onClick={() => navigate('/cart')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </motion.button>
                </div>
            </div>
        </nav>
    );
};

export default Header; 