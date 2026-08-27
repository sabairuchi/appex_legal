import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;

  if (connUri) {
    try {
      if (mongoose.connection.readyState === 1) {
        isMongooseConnected = true;
        return mongoose.connection;
      }
      const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
      isMongooseConnected = true;
      console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB Warning] MongoDB URI connection failed (${err.message}). Operating in DEMO MODE with file/memory storage.`);
      isMongooseConnected = false;
    }
  } else {
    console.log('[DB] MONGODB_URI not provided. Operating in DEMO MODE with persistent local file/memory storage.');
    isMongooseConnected = false;
  }
};
