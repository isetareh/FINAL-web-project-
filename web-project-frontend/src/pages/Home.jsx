import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Shield, Truck, Headphones } from 'lucide-react';
import ProductList from '../components/ProductList';

const Home = ({ currentUser, cart, onAddToCart, onViewDetails }) => {
    return (
        <div>
            {/* Hero Section */}
            <motion.div 
                className="container-main text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-white display-4 mb-4">
                    <i className="fas fa-mobile-alt me-3"></i>
                    فروشگاه موبایل
                </h1>
                <p className="text-white-50 lead mb-5">
                    بهترین گوشی‌های موبایل با بهترین قیمت‌ها
                </p>
                <motion.button 
                    className="btn btn-primary btn-lg"
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ShoppingCart size={20} className="me-2" />
                    مشاهده محصولات
                </motion.button>
            </motion.div>

            {/* Features Section */}
            <motion.div 
                className="container-main"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="text-white text-center mb-5">چرا ما را انتخاب کنید؟</h2>
                <div className="row">
                    <motion.div 
                        className="col-md-3 text-center mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="card h-100">
                            <div className="card-body">
                                <Shield size={48} className="text-primary mb-3" />
                                <h5 className="card-title">ضمانت اصالت</h5>
                                <p className="card-text">تمام محصولات ما اصل و دارای گارانتی معتبر هستند</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="col-md-3 text-center mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div className="card h-100">
                            <div className="card-body">
                                <Truck size={48} className="text-success mb-3" />
                                <h5 className="card-title">ارسال رایگان</h5>
                                <p className="card-text">ارسال رایگان برای تمام سفارشات بالای 500 هزار تومان</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="col-md-3 text-center mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div className="card h-100">
                            <div className="card-body">
                                <Headphones size={48} className="text-info mb-3" />
                                <h5 className="card-title">پشتیبانی 24/7</h5>
                                <p className="card-text">پشتیبانی 24 ساعته در تمام روزهای هفته</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="col-md-3 text-center mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="card h-100">
                            <div className="card-body">
                                <ShoppingCart size={48} className="text-warning mb-3" />
                                <h5 className="card-title">پرداخت امن</h5>
                                <p className="card-text">پرداخت امن و مطمئن با درگاه‌های معتبر</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Products Section */}
            <div id="products">
                <ProductList 
                    currentUser={currentUser}
                    cart={cart}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                />
            </div>
        </div>
    );
};

export default Home; 