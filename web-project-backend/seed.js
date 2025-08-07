require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "iPhone 15 Pro",
    price: 76064848,
    description: "گوشی اپل با طراحی تیتانیومی، صفحه نمایش 6.1 اینچ Super Retina XDR OLED و دوربین چهارگانه",
    image: "iPhone 15 Pro.jpg"
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    price: 85801168,
    description: "گوشی سامسونگ پرچمدار با صفحه نمایش 6.8 اینچ Dynamic AMOLED 2X، دوربین 200 مگاپیکسل و قلم S Pen",
    image: "Samsung Galaxy S24 Ultra.jpg"
  },
  {
    name: "Google Pixel 8 Pro",
    price: 32707798,
    description: "گوشی گوگل با چیپ Tensor G3، صفحه نمایش 6.7 اینچ LTPO OLED و دوربین 64 مگاپیکسل",
    image: "Google Pixel 8 Pro.jpg"
  },
  {
    name: "OnePlus 12",
    price: 29208960,
    description: "گوشی OnePlus با صفحه نمایش 6.82 اینچ LTPO AMOLED ProXDR، چیپ Snapdragon 8 Gen 3 و باتری 5400mAh",
    image: "one plus 12.jpg"
  },
  {
    name: "Xiaomi 14 Pro",
    price: 30733000,
    description: "گوشی شیائومی با چیپ Snapdragon 8 Gen 3، صفحه نمایش 6.73 اینچ LTPO AMOLED و دوربین 50 مگاپیکسل",
    image: "Xiaomi 14 Pro.png"
  },
  {
    name: "Sony Xperia 1 VI",
    price: 67241308,
    description: "گوشی سونی با نمایشگر 6.5 اینچ 120Hz، دوربین سه‌گانه حرفه‌ای با زوم اپتیکال مداوم و چیپ Snapdragon 8 Gen 3",
    image: "Sony Xperia 1 VI.jpg"
  }
];

const connectDB = require('./config/db');

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Successfully seeded ${insertedProducts.length} products`);
    
    // Display seeded products
    console.log('\nSeeded products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.price.toLocaleString()} تومان`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 