import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 * Uses Mongoose with connection pooling and error handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    setupConnectionHandlers();

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // Fallback to In-Memory Database
    try {
      console.log('⚠️  Attempting to start In-Memory MongoDB...');
      // Dynamic import to avoid production issues if dev dependency is missing
      const { MongoMemoryServer } = await import('mongodb-memory-server'); 
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      
      console.log('====================================================');
      console.log('🚨 USING IN-MEMORY DATABASE');
      console.log('   Data will be LOST when server restarts.');
      console.log('   To use real DB, start MongoDB or set valid MONGO_URI');
      console.log(`   👉 CONNECTION STRING: ${uri}`);
      console.log('====================================================');

      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Memory Server Connected: ${conn.connection.host}`);
      
      setupConnectionHandlers();
      
    } catch (memError) {
      console.error(`❌ Failed to start In-Memory DB: ${memError.message}`);
      process.exit(1);
    }
  }
};

const setupConnectionHandlers = () => {
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed through app termination');
    process.exit(0);
  });
};

export default connectDB;