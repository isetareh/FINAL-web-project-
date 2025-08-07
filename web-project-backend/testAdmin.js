require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');

const testAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Find admin user
    const adminUser = await User.findOne({ username: 'admin' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('isAdmin:', adminUser.isAdmin);
    console.log('ID:', adminUser._id);
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isMatch) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect!');
    }
    
    // Test login process
    const user = await User.findOne({ username: 'admin' });
    if (!user) {
      console.log('❌ User not found during login test');
      return;
    }
    
    const passwordMatch = await bcrypt.compare('admin123', user.password);
    if (!passwordMatch) {
      console.log('❌ Password comparison failed');
      return;
    }
    
    console.log('✅ Login test passed!');
    console.log('User data:', {
      id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing admin user:', error);
    process.exit(1);
  }
};

testAdminUser();
