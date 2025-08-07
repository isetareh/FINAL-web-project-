import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Crown } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            
            toast.success(
                response.data.user.isAdmin 
                    ? 'ورود ادمین با موفقیت انجام شد!' 
                    : 'ورود با موفقیت انجام شد!'
            );
            
            onLogin(response.data.user);
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.error || 'خطا در ورود';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-main">
            <motion.div 
                className="row justify-content-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="mb-4">
                                {isAdmin ? (
                                    <Crown size={48} className="text-warning mb-3" />
                                ) : (
                                    <User size={48} className="text-primary mb-3" />
                                )}
                                <h3 className="card-title">
                                    {isAdmin ? 'ورود ادمین' : 'ورود به حساب کاربری'}
                                </h3>
                                <p className="text-muted">
                                    {isAdmin ? 'برای مدیریت محصولات وارد شوید' : 'برای خرید وارد شوید'}
                                </p>
                            </div>

                            {/* Admin/User Toggle */}
                            <div className="mb-4">
                                <div className="btn-group w-100" role="group">
                                    <motion.button
                                        type="button"
                                        className={`btn ${!isAdmin ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => setIsAdmin(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <User size={16} className="me-2" />
                                        کاربر عادی
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className={`btn ${isAdmin ? 'btn-warning' : 'btn-outline-warning'}`}
                                        onClick={() => setIsAdmin(true)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Crown size={16} className="me-2" />
                                        ادمین
                                    </motion.button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <User size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="نام کاربری"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <Lock size={16} />
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder="رمز عبور"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <motion.button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </motion.button>
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">در حال بارگذاری...</span>
                                        </div>
                                    ) : (
                                        <User size={16} className="me-2" />
                                    )}
                                    {isAdmin ? 'ورود ادمین' : 'ورود'}
                                </motion.button>

                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        حساب کاربری ندارید؟{' '}
                                        <a href="/register" className="text-decoration-none">
                                            ثبت نام کنید
                                        </a>
                                    </p>
                                </div>
                            </form>

                            {/* Admin Info */}
                            {isAdmin && (
                                <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded">
                                    <h6 className="text-warning mb-2">
                                        <Crown size={16} className="me-2" />
                                        اطلاعات ادمین
                                    </h6>
                                    <p className="text-muted small mb-1">
                                        <strong>نام کاربری:</strong> admin
                                    </p>
                                    <p className="text-muted small mb-0">
                                        <strong>رمز عبور:</strong> admin123
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login; 