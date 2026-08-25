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
import User from './src/models/user.model.js';
import { errorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(async () => {
  // Seed initial Admin user safely if no admin user exists
  try {
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
      console.log(`[Admin Seed] Created initial system admin account (${initialAdminEmail}).`);
    }
  } catch (err) {
    console.warn('[Admin Seed Warning]:', err.message);
  }
});

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows Unsplash images & inline SVGs during development
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Static Serving for Uploads Directory
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Apex Legal API Server running on port ${PORT}`);
});

