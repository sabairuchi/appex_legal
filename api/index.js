import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { connectDB } from '../server/src/config/db.js';
import healthRoutes from '../server/src/routes/health.routes.js';
import authRoutes from '../server/src/routes/auth.routes.js';
import clientRoutes from '../server/src/routes/client.routes.js';
import adminRoutes from '../server/src/routes/admin.routes.js';
import { seedInitialAdmin } from '../server/src/utils/seedAdmin.js';
import { errorHandler } from '../server/src/middleware/errorHandler.js';

dotenv.config();

const app = express();

let dbInitialized;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    dbInitialized = connectDB()
      .then(() => seedInitialAdmin())
      .catch((err) => {
        dbInitialized = null;
        throw err;
      });
  }

  return dbInitialized;
};

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Parsing Middleware
app.use(express.json());
app.use(cookieParser());

// Database Initialization
app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (err) {
    console.error('[DB Init Error]:', err.message);

    res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
  }
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler
app.use(errorHandler);

export default app;
