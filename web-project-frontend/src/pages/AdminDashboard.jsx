import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    Search, 
    Filter, 
    ArrowLeft,
    Crown,
    Package,
    Users,
    ShoppingCart,
    DollarSign
} from 'lucide-react';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = ({ currentUser }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

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
            toast.error('خطا در بارگذاری محصولات');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file
            }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price || !formData.description) {
            toast.error('لطفاً تمام فیلدهای ضروری را پر کنید!');
            return;
        }

        try {
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('price', formData.price);
            productData.append('description', formData.description);
            
            if (formData.image) {
                productData.append('image', formData.image);
            }

            if (showEditForm && selectedProduct) {
                await productsAPI.update(selectedProduct._id, productData);
                toast.success('محصول با موفقیت به‌روزرسانی شد!');
            } else {
                await productsAPI.create(productData);
                toast.success('محصول با موفقیت اضافه شد!');
            }
            
            await loadProducts();
            resetForm();
            
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('خطا در ذخیره محصول');
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            image: null
        });
        setImagePreview(null);
        setShowEditForm(true);
        setShowAddForm(false);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
            try {
                await productsAPI.delete(productId);
                toast.success('محصول با موفقیت حذف شد!');
                await loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('خطا در حذف محصول');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            image: null
        });
        setImagePreview(null);
        setSelectedProduct(null);
        setShowAddForm(false);
        setShowEditForm(false);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!currentUser?.isAdmin) {
        return (
            <div className="container-main text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <i className="fas fa-user-lock fa-3x mb-3 text-warning"></i>
                    <h3 className="text-white mb-3">دسترسی محدود</h3>
                    <p className="text-white-50 mb-4">
                        فقط ادمین‌ها می‌توانند به این صفحه دسترسی داشته باشند
                    </p>
                    <motion.button
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        بازگشت به صفحه اصلی
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container-main">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="text-white mb-2">
                            <Crown size={24} className="me-2" />
                            پنل مدیریت ادمین
                        </h2>
                        <p className="text-white-50">مدیریت محصولات و تنظیمات فروشگاه</p>
                    </div>
                    <div className="d-flex gap-2">
                        <motion.button
                            className="btn btn-outline-light"
                            onClick={() => window.location.href = '/'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft size={16} className="me-2" />
                            بازگشت
                        </motion.button>
                        <motion.button
                            className="btn btn-success"
                            onClick={() => {
                                resetForm();
                                setShowAddForm(true);
                                setShowEditForm(false);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus size={16} className="me-2" />
                            افزودن محصول
                        </motion.button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <motion.div 
                            className="card bg-primary text-white"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <Package size={32} className="mb-2" />
                                <h4>{products.length}</h4>
                                <p className="mb-0">کل محصولات</p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-3">
                        <motion.div 
                            className="card bg-success text-white"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <Users size={32} className="mb-2" />
                                <h4>0</h4>
                                <p className="mb-0">کاربران فعال</p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-3">
                        <motion.div 
                            className="card bg-warning text-white"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <ShoppingCart size={32} className="mb-2" />
                                <h4>0</h4>
                                <p className="mb-0">سفارشات</p>
                            </div>
                        </motion.div>
                    </div>
                    <div className="col-md-3">
                        <motion.div 
                            className="card bg-info text-white"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="card-body text-center">
                                <DollarSign size={32} className="mb-2" />
                                <h4>0</h4>
                                <p className="mb-0">درآمد کل</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {(showAddForm || showEditForm) && (
                    <motion.div 
                        className="card mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="card-header">
                            <h5 className="mb-0">
                                {showEditForm ? 'ویرایش محصول' : 'افزودن محصول جدید'}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">نام محصول <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="نام محصول"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">قیمت (تومان) <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="قیمت"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">توضیحات <span className="text-danger">*</span></label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="توضیحات محصول"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">تصویر محصول</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="mt-2 img-thumbnail"
                                            style={{ maxHeight: '100px' }}
                                        />
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    <motion.button
                                        type="submit"
                                        className="btn btn-primary"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {showEditForm ? 'به‌روزرسانی' : 'افزودن'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        انصراف
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* Products List */}
                <div className="card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">لیست محصولات</h5>
                            <div className="d-flex gap-2">
                                <div className="input-group" style={{ width: '300px' }}>
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
                        </div>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center">
                                <div className="loading"></div>
                                <p className="text-muted mt-3">در حال بارگذاری محصولات...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center text-muted">
                                <Package size={48} className="mb-3" />
                                <h5>محصولی یافت نشد</h5>
                                <p>برای افزودن محصول جدید کلیک کنید</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>تصویر</th>
                                            <th>نام محصول</th>
                                            <th>قیمت</th>
                                            <th>توضیحات</th>
                                            <th>عملیات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <motion.tr
                                                key={product._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td>
                                                    <img
                                                        src={`http://localhost:5000/images/${encodeURIComponent(product.image)}`}
                                                        alt={product.name}
                                                        className="img-thumbnail"
                                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'block';
                                                        }}
                                                    />
                                                    <i className="fas fa-mobile-alt" style={{ display: 'none', fontSize: '1.5rem', color: '#6c757d' }}></i>
                                                </td>
                                                <td>{product.name}</td>
                                                <td className="text-primary fw-bold">{formatPrice(product.price)} تومان</td>
                                                <td>
                                                    <small className="text-muted">
                                                        {product.description.substring(0, 50)}...
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <motion.button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => handleEdit(product)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            title="ویرایش"
                                                        >
                                                            <Edit size={14} />
                                                        </motion.button>
                                                        <motion.button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => handleDelete(product._id)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            title="حذف"
                                                        >
                                                            <Trash2 size={14} />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
