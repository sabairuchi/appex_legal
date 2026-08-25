import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getDashboard,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getAppointments,
  createAppointment,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getDocuments,
  uploadDocument,
  downloadDocument,
} from '../controllers/client.controller.js';

const router = express.Router();

// Memory storage for multer file processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// All client routes require authentication
router.use(protect);
router.use(authorize('client', 'lawyer', 'admin'));

// Dashboard Route
router.get('/dashboard', getDashboard);

// Profile Routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/profile-image', upload.single('profileImage'), uploadProfileImage);

// Appointment Routes
router.get('/appointments', getAppointments);
router.post('/appointments', createAppointment);

// Notification Routes
router.get('/notifications', getNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);

// Document Routes
router.get('/documents', getDocuments);
router.post('/documents', upload.single('file'), uploadDocument);
router.get('/documents/:id/download', downloadDocument);

export default router;
