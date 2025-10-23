const { connectToDatabase } = require('../database/mongoose')

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    const mongoose = await connectToDatabase()
    console.log('✅ Successfully connected to MongoDB!')
    if (mongoose.connection.db) {
      console.log(`Connected to database: ${mongoose.connection.db.databaseName}`)
    }
    await mongoose.disconnect()
    console.log('Connection closed.')
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

testConnection()