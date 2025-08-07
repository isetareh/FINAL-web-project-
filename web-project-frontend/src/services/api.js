import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request - Token from localStorage:', token ? 'Present' : 'Missing');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('API Request - Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.log('API Request - No token found, request will be sent without Authorization header');
        }
        
        console.log('API Request - URL:', config.url);
        console.log('API Request - Method:', config.method);
        console.log('API Request - Headers:', config.headers);
        
        return config;
    },
    (error) => {
        console.error('API Request - Interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response - Success:', response.config.url, response.status);
        return response;
    },
    (error) => {
        console.error('API Response - Error:', error.config?.url, error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            console.log('API Response - 401 Unauthorized, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            // Use window.location for redirect since this is not a React component
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/api/auth/register', userData),
    login: (credentials) => api.post('/api/auth/login', credentials),
    logout: () => api.post('/api/auth/logout'),
    getCurrentUser: () => api.get('/api/auth/me'),
};

// Products API
export const productsAPI = {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (productData) => api.post('/api/products', productData),
    update: (id, productData) => api.put(`/api/products/${id}`, productData),
    delete: (id) => api.delete(`/api/products/${id}`),
};

// Cart API
export const cartAPI = {
    getCart: () => api.get('/api/cart'),
    addToCart: (productId, quantity = 1) => api.post('/api/cart/add', { productId, quantity }),
    updateQuantity: (productId, quantity) => api.put(`/api/cart/${productId}`, { quantity }),
    removeFromCart: (productId) => api.delete(`/api/cart/${productId}`),
    clearCart: () => api.delete('/api/cart'),
    cleanupCart: () => api.post('/api/cart/cleanup'),
};

export default api; 