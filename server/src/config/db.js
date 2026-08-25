import mongoose from 'mongoose';

export let isMongooseConnected = false;

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;

  if (connUri) {
    try {
      const conn = await mongoose.connect(connUri, { serverSelectionTimeoutMS: 3000 });
      isMongooseConnected = true;
      console.log(`[DB] Connected to MongoDB: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[DB Warning] MongoDB URI connection failed (${err.message}). Using Embedded Persistence Engine.`);
    }
  }

  console.log('[DB] Running with Embedded Apex Persistence Engine (server/data/users.json).');
};
