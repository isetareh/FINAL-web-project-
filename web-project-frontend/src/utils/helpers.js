// Format price to Persian numbers with commas
export const formatPrice = (price) => {
    return price.toLocaleString('fa-IR');
};

// Show alert/toast message
export const showAlert = (message, type = 'info') => {
    // This will be replaced with react-hot-toast in components
    console.log(`${type}: ${message}`);
};

// Validate email format
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
    return password.length >= 6;
};

// Sample products data (fallback)
export const sampleProducts = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 76064848,
        description: "گوشی اپل با طراحی تیتانیومی، صفحه نمایش 6.1 اینچ Super Retina XDR OLED و دوربین چهارگانه",
        image: "default.jpg"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 85801168,
        description: "گوشی سامسونگ پرچمدار با صفحه نمایش 6.8 اینچ Dynamic AMOLED 2X، دوربین 200 مگاپیکسل و قلم S Pen",
        image: "default.jpg"
    },
    {
        id: 3,
        name: "Google Pixel 8 Pro",
        price: 32707798,
        description: "گوشی گوگل با چیپ Tensor G3، صفحه نمایش 6.7 اینچ LTPO OLED و دوربین 64 مگاپیکسل",
        image: "default.jpg"
    },
    {
        id: 4,
        name: "OnePlus 12",
        price: 29208960,
        description: "گوشی OnePlus با صفحه نمایش 6.82 اینچ LTPO AMOLED ProXDR، چیپ Snapdragon 8 Gen 3 و باتری 5400mAh",
        image: "default.jpg"
    },
    {
        id: 5,
        name: "Xiaomi 14 Pro",
        price: 30733000,
        description: "گوشی شیائومی با چیپ Snapdragon 8 Gen 3، صفحه نمایش 6.73 اینچ LTPO AMOLED و دوربین 50 مگاپیکسل",
        image: "default.jpg"
    },
    {
        id: 6,
        name: "Sony Xperia 1 VI",
        price: 67241308,
        description: "گوشی سونی با نمایشگر 6.5 اینچ 120Hz، دوربین سه‌گانه حرفه‌ای با زوم اپتیکال مداوم و چیپ Snapdragon 8 Gen 3",
        image: "default.jpg"
    }
];

// Sample users data (fallback)
export const sampleUsers = [
    { username: 'admin', password: 'admin123', email: 'admin@shop.com', role: 'admin', cart: {} },
    { username: 'user', password: 'user123', email: 'user@shop.com', role: 'user', cart: {} }
]; 