import mongoose from 'mongoose';

const cached = globalThis.mongoose || {
  conn: null,
  promise: null,
};

globalThis.mongoose = cached;

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI;

  if (!connUri) {
    throw new Error('MONGODB_URI environment variable is missing');
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(connUri, opts)
      .then((mongooseInstance) => {
        console.log(
          `[DB] Connected to MongoDB: ${mongooseInstance.connection.host}`
        );
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};