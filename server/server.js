
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import path from 'path';

import healthRoutes from './src/routes/health.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

import { seedInitialAdmin } from './src/utils/seedAdmin.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();

// Database connection and initial admin seeding
let dbReady;

const ensureDatabase = async () => {
  if (!dbReady) {
    dbReady = connectDB()
      .then(() => seedInitialAdmin())
      .catch((err) => {
        dbReady = null;
        throw err;
      });
  }

  return dbReady;
};

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parsing Middleware
app.use(express.json());
app.use(cookieParser());

// Database initialization before handling requests
app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    console.error('[DB Startup Error]:', err.message);
    next(err);
  }
});

// Static Serving for Uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Controlled runtime error testing
if (process.env.RUNTIME_ERROR_TEST === 'true') {
  app.get('/api/runtime-test/:code', (req, res, next) => {
    const code = Number(req.params.code);

    if (![500, 502, 503].includes(code)) {
      return res.status(400).json({
        message: 'Unsupported test status'
      });
    }

    const error = new Error('Controlled runtime failure');
    error.statusCode = code;

    next(error);
  });
}

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

// Export Express app for Vercel Services
export default app;
