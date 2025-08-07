import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const AddProduct = ({ currentUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

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
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!currentUser?.isAdmin) {
            toast.error('فقط ادمین‌ها می‌توانند محصول اضافه کنند!');
            return;
        }

        if (!formData.name || !formData.price || !formData.description) {
            toast.error('لطفاً تمام فیلدهای ضروری را پر کنید!');
            return;
        }

        setLoading(true);

        try {
            const productData = new FormData();
            productData.append('name', formData.name);
            productData.append('price', formData.price);
            productData.append('description', formData.description);
            
            if (formData.image) {
                productData.append('image', formData.image);
            }

            await productsAPI.create(productData);
            
            toast.success('محصول با موفقیت اضافه شد!');
            
            // Reset form
            setFormData({
                name: '',
                price: '',
                description: '',
                image: null
            });
            setImagePreview(null);
            
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('خطا در افزودن محصول');
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };

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
                        فقط ادمین‌ها می‌توانند محصول اضافه کنند
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
                            <Plus size={24} className="me-2" />
                            افزودن محصول جدید
                        </h2>
                        <p className="text-white-50">اطلاعات محصول جدید را وارد کنید</p>
                    </div>
                    <motion.button
                        className="btn btn-outline-light"
                        onClick={() => window.location.href = '/'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        بازگشت
                    </motion.button>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Product Name */}
                                    <div className="mb-3">
                                        <label className="form-label text-white">
                                            نام محصول <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="مثال: iPhone 15 Pro"
                                            required
                                        />
                                    </div>

                                    {/* Price */}
                                    <div className="mb-3">
                                        <label className="form-label text-white">
                                            قیمت (تومان) <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="مثال: 76064848"
                                            min="0"
                                            required
                                        />
                                        {formData.price && (
                                            <small className="text-muted">
                                                نمایش: {formatPrice(parseInt(formData.price))} تومان
                                            </small>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label text-white">
                                            توضیحات محصول <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="توضیحات کامل محصول را وارد کنید..."
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-4">
                                        <label className="form-label text-white">
                                            تصویر محصول
                                        </label>
                                        <div className="border-2 border-dashed border-secondary rounded p-4 text-center">
                                            {imagePreview ? (
                                                <div className="position-relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="img-fluid rounded mb-3"
                                                        style={{ maxHeight: '200px' }}
                                                    />
                                                    <motion.button
                                                        type="button"
                                                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                        onClick={removeImage}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload size={48} className="text-muted mb-3" />
                                                    <p className="text-muted mb-2">
                                                        برای آپلود تصویر کلیک کنید یا فایل را بکشید
                                                    </p>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        style={{ display: 'none' }}
                                                        id="image-upload"
                                                    />
                                                    <label
                                                        htmlFor="image-upload"
                                                        className="btn btn-outline-primary"
                                                    >
                                                        <Upload size={16} className="me-2" />
                                                        انتخاب تصویر
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">در حال بارگذاری...</span>
                                                </div>
                                                در حال افزودن محصول...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="me-2" />
                                                افزودن محصول
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Preview Card */}
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">پیش‌نمایش محصول</h5>
                            </div>
                            <div className="card-body">
                                {formData.name || formData.price || formData.description ? (
                                    <div>
                                        <div className="text-center mb-3">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '150px' }}
                                                />
                                            ) : (
                                                <div className="bg-light rounded p-4">
                                                    <i className="fas fa-mobile-alt fa-2x text-muted"></i>
                                                </div>
                                            )}
                                        </div>
                                        <h6 className="card-title">{formData.name || 'نام محصول'}</h6>
                                        <p className="text-primary fw-bold">
                                            {formData.price ? formatPrice(parseInt(formData.price)) : '0'} تومان
                                        </p>
                                        <p className="card-text small text-muted">
                                            {formData.description || 'توضیحات محصول'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted">
                                        <i className="fas fa-mobile-alt fa-2x mb-3"></i>
                                        <p>اطلاعات محصول را وارد کنید تا پیش‌نمایش را ببینید</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Info */}
                        <div className="card mt-3">
                            <div className="card-header bg-warning text-dark">
                                <h6 className="mb-0">
                                    <i className="fas fa-crown me-2"></i>
                                    اطلاعات ادمین
                                </h6>
                            </div>
                            <div className="card-body">
                                <p className="small text-muted mb-1">
                                    <strong>کاربر:</strong> {currentUser?.username}
                                </p>
                                <p className="small text-muted mb-0">
                                    <strong>نقش:</strong> ادمین
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AddProduct; 