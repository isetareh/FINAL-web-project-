import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Shield, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminLogin = ({ onLogin, onBack }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
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
            
            if (response.data.user.isAdmin) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                onLogin(response.data.user);
                toast.success('ورود ادمین با موفقیت انجام شد!');
            } else {
                toast.error('این حساب کاربری ادمین نیست!');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            toast.error('خطا در ورود ادمین');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-main">
            <motion.div
                className="row justify-content-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <motion.div
                                className="mb-4"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Shield size={64} className="text-primary" />
                            </motion.div>
                            
                            <h3 className="card-title mb-4">ورود ادمین</h3>
                            <p className="text-muted mb-4">لطفاً اطلاعات ادمین خود را وارد کنید</p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <User size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            placeholder="نام کاربری ادمین"
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
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="رمز عبور"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
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
                                        <span>
                                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                            در حال ورود...
                                        </span>
                                    ) : (
                                        <span>
                                            <Shield size={16} className="me-2" />
                                            ورود ادمین
                                        </span>
                                    )}
                                </motion.button>
                            </form>

                            <motion.button
                                className="btn btn-outline-secondary w-100"
                                onClick={onBack}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ArrowLeft size={16} className="me-2" />
                                بازگشت به ورود کاربر
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
