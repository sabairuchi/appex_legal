import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const connUri = process.env.MONGODB_URI;

  if (isProduction && !connUri) {
    throw new Error('Database configuration error: MONGODB_URI environment variable is required in production.');
  }

  if (connUri) {
    try {
      if (mongoose.connection.readyState === 1) {
        isMongooseConnected = true;
        return mongoose.connection;
      }
      const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 5000 });
      isMongooseConnected = true;
      console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      if (isProduction) {
        throw new Error(`Database connection failed in production: ${err.message}`);
      }
      console.warn(`[DB Warning] MongoDB URI connection failed (${err.message}). Using local development persistence engine.`);
    }
  }

  if (isProduction) {
    throw new Error('Database connection required in production environment.');
  }

  console.log('[DB] Running with local development persistence engine.');
};
