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
import User from '../server/src/models/user.model.js';
import { errorHandler } from '../server/src/middleware/errorHandler.js';

dotenv.config();

const app = express();

let dbInitialized = false;

app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!dbInitialized) {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const initialAdminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@apexlegal.com';
        const initialAdminPass = process.env.ADMIN_INITIAL_PASSWORD || 'ApexAdmin2026!';
        const hash = await User.hashPassword(initialAdminPass);
        await User.create({
          fullName: 'Apex Admin',
          email: initialAdminEmail.toLowerCase(),
          passwordHash: hash,
          role: 'admin',
          isActive: true,
        });
      }
      dbInitialized = true;
    }
    next();
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      return next(err);
    }
    console.warn('[DB Init Warning]:', err.message);
    dbInitialized = true;
    next();
  }
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
