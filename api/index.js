import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from '../server/src/config/db.js';
import healthRoutes from '../server/src/routes/health.routes.js';
import authRoutes from '../server/src/routes/auth.routes.js';
import clientRoutes from '../server/src/routes/client.routes.js';
import adminRoutes from '../server/src/routes/admin.routes.js';
import { seedInitialAdmin } from '../server/src/utils/seedAdmin.js';

dotenv.config();

const app = express();

let dbInitialized = false;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!dbInitialized) {
      await seedInitialAdmin();
      dbInitialized = true;
    }
    next();
  } catch (err) {
    console.error('[DB Init Error]:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
  }
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default (req, res) => app(req, res);
