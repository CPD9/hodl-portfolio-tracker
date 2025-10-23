require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    await mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection();