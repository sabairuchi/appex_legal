import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  getLawyers,
  createLawyer,
  updateLawyer,
  deactivateLawyer,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  assignLawyerToAppointment,
  rescheduleAppointment,
  getAnalytics,
} from '../controllers/admin.controller.js';
import { authenticateUser, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Enforce authentication & admin role authorization on ALL /api/admin/* endpoints
router.use(authenticateUser);
router.use(requireRole('admin'));

// Dashboard Stats
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Lawyer Management
router.get('/lawyers', getLawyers);
router.post('/lawyers', createLawyer);
router.patch('/lawyers/:id', updateLawyer);
router.delete('/lawyers/:id', deactivateLawyer);

// Appointment Management
router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointmentById);
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.patch('/appointments/:id/assign-lawyer', assignLawyerToAppointment);
router.patch('/appointments/:id/reschedule', rescheduleAppointment);

// Analytics Dashboard
router.get('/analytics', getAnalytics);

export default router;
