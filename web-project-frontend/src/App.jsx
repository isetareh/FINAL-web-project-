import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import { authAPI, cartAPI } from './services/api';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    useEffect(() => {
        if (currentUser) {
            loadCart();
        } else {
            setCart({ items: [], total: 0 });
        }
    }, [currentUser]);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('currentUser');
            
            if (token && storedUser) {
                // Set user from localStorage immediately
                setCurrentUser(JSON.parse(storedUser));
                
                // Verify token with backend
                try {
                    const response = await authAPI.getCurrentUser();
                    setCurrentUser(response.data);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('currentUser');
                    setCurrentUser(null);
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    const loadCart = async () => {
        if (!currentUser) return;
        
        try {
            const response = await cartAPI.getCart();
            setCart(response.data);
        } catch (error) {
            console.error('Error loading cart:', error);
            
            // Try to cleanup cart if there's an error
            try {
                await cartAPI.cleanupCart();
                const cleanupResponse = await cartAPI.getCart();
                setCart(cleanupResponse.data);
            } catch (cleanupError) {
                console.error('Cleanup failed:', cleanupError);
                setCart({ items: [], total: 0 });
            }
        }
    };

    const handleLogin = (user) => {
        console.log('Login successful:', user);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        setCurrentUser(null);
        setCart({ items: [], total: 0 });
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    };

    const handleAddToCart = async (productId) => {
        if (!currentUser) {
            toast.error('برای افزودن به سبد خرید ابتدا وارد شوید!');
            return;
        }

        try {
            await cartAPI.addToCart(productId);
            await loadCart(); // Reload cart from backend
            toast.success('محصول به سبد خرید اضافه شد!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('خطا در افزودن به سبد خرید');
        }
    };

    const handleUpdateCart = async () => {
        await loadCart(); // Reload cart when updated from Cart component
    };

    const handleViewDetails = (productId) => {
        // This function is now handled in ProductCard component
        console.log('View product details:', productId);
    };

    const cartCount = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="loading"></div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '15px',
                        },
                    }}
                />
                
                <Header 
                    currentUser={currentUser}
                    cartCount={cartCount}
                    onLogout={handleLogout}
                />
                
                <div className="container mt-4">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <Home 
                                    currentUser={currentUser}
                                    cart={cart}
                                    onAddToCart={handleAddToCart}
                                    onViewDetails={handleViewDetails}
                                />
                            } 
                        />
                        <Route 
                            path="/cart" 
                            element={
                                <Cart 
                                    currentUser={currentUser}
                                    cart={cart}
                                    onUpdateCart={handleUpdateCart}
                                />
                            } 
                        />
                        <Route 
                            path="/login" 
                            element={
                                currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                currentUser ? <Navigate to="/" /> : <Register onLogin={handleLogin} />
                            } 
                        />
                        <Route 
                            path="/add-product" 
                            element={
                                <AddProduct currentUser={currentUser} />
                            } 
                        />
                        <Route 
                            path="/admin" 
                            element={
                                <AdminDashboard currentUser={currentUser} />
                            } 
                        />
                        <Route 
                            path="/product/:id" 
                            element={
                                <ProductDetails 
                                    currentUser={currentUser}
                                    onAddToCart={handleAddToCart}
                                />
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App; 