const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Remove deprecated options that no longer work with Mongoose 8+
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, exit if database connection fails
      process.exit(1);
    } else {
      // In development, continue but log warning
      console.warn('⚠️  Continuing in development mode without database connection');
      console.warn('⚠️  API will work but database operations will fail');
    }
  }
};

module.exports = connectDB;
