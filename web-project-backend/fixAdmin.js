require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');

const fixAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Delete existing admin user
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ Deleted existing admin user');
    
    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@shop.com',
      password: hashedPassword,
      isAdmin: true
    });
    
    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@shop.com');
    console.log('Role: Admin');
    
    // Test the new user
    const testUser = await User.findOne({ username: 'admin' });
    const passwordMatch = await bcrypt.compare('admin123', testUser.password);
    
    if (passwordMatch) {
      console.log('✅ Password test passed!');
    } else {
      console.log('❌ Password test failed!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin user:', error);
    process.exit(1);
  }
};

fixAdminUser();
