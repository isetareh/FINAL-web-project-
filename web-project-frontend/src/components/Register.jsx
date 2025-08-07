import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import { authAPI } from '../services/api';
import { validateEmail, validatePassword } from '../utils/helpers';
import toast from 'react-hot-toast';

const Register = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('لطفاً تمام فیلدها را پر کنید');
            return false;
        }

        if (!validateEmail(formData.email)) {
            toast.error('لطفاً ایمیل معتبر وارد کنید');
            return false;
        }

        if (!validatePassword(formData.password)) {
            toast.error('رمز عبور باید حداقل 6 کاراکتر باشد');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('رمز عبور و تکرار آن یکسان نیستند');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authAPI.register(registerData);
            
            // If registration includes login response, use it
            if (response.data.user && response.data.token) {
                const { user, token } = response.data;
                
                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Update app state
                onLogin(user);
                
                toast.success('ثبت نام و ورود با موفقیت انجام شد!');
                
                // Navigate to home page using React Router
                navigate('/');
            } else {
                // If registration doesn't include login, redirect to login page
                toast.success('ثبت نام با موفقیت انجام شد! اکنون وارد شوید.');
                navigate('/login');
            }
        } catch (error) {
            console.error('Register error:', error);
            const message = error.response?.data?.message || 'خطا در ثبت نام';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <motion.h3 
                className="text-center mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <UserPlus size={24} className="me-2" />
                ثبت نام
            </motion.h3>
            
            <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="mb-3">
                    <label className="form-label">نام کاربری</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                
                <div className="mb-3">
                    <label className="form-label">ایمیل</label>
                    <div className="input-group">
                        <span className="input-group-text">
                            <Mail size={16} />
                        </span>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">رمز عبور</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <motion.button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </motion.button>
                    </div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">تکرار رمز عبور</label>
                    <div className="input-group">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <motion.button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                        <>
                            <div className="loading me-2"></div>
                            در حال ثبت نام...
                        </>
                    ) : (
                        <>
                            <UserPlus size={16} className="me-2" />
                            ثبت نام
                        </>
                    )}
                </motion.button>
                
                <div className="text-center">
                    <span>قبلاً ثبت نام کرده‌اید؟ </span>
                    <motion.a 
                        href="#" 
                        onClick={() => navigate('/login')}
                        className="text-primary"
                        whileHover={{ scale: 1.05 }}
                    >
                        وارد شوید
                    </motion.a>
                </div>
            </motion.form>
        </div>
    );
};

export default Register; 