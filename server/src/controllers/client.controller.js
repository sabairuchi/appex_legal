import path from 'path';
import fs from 'fs';
import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';
import Notification from '../models/notification.model.js';
import Document from '../models/document.model.js';
import { uploadFile, validateImageFile, validateDocumentFile } from '../services/storage.service.js';

// @desc    Get complete Client Dashboard Overview
// @route   GET /api/client/dashboard
// @access  Private (Client)
export const getDashboard = async (req, res, next) => {
  try {
    const clientId = req.user._id;

    // Fetch User Profile
    const user = await User.findById(clientId);

    // Fetch Assigned Lawyer if present
    let assignedLawyer = null;
    if (user && user.assignedLawyerId) {
      const lawyerDoc = await User.findById(user.assignedLawyerId);
      if (lawyerDoc) {
        assignedLawyer = {
          _id: lawyerDoc._id,
          fullName: lawyerDoc.fullName,
          email: lawyerDoc.email,
          profileImage: lawyerDoc.profileImage || '',
          role: lawyerDoc.role,
          bio: lawyerDoc.bio || 'Senior Legal Counsel & Practice Head',
        };
      }
    }

    // Fetch Appointments for client
    const rawAppointments = await Appointment.find({ client: clientId });
    const appointments = Array.isArray(rawAppointments) ? rawAppointments : [];
    
    // Sort & pick upcoming appointment (status pending, approved, confirmed, rescheduled)
    const upcomingAppointment = appointments.find((a) =>
      ['pending', 'approved', 'confirmed', 'rescheduled'].includes(a.status)
    ) || null;

    // Fetch Recent Notifications
    const rawNotifications = await Notification.find({ client: clientId });
    const notifications = Array.isArray(rawNotifications) ? rawNotifications.slice(0, 5) : [];

    // Fetch Recent Documents
    const rawDocuments = await Document.find({ client: clientId });
    const documents = Array.isArray(rawDocuments) ? rawDocuments.slice(0, 5) : [];

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '',
          bio: user.bio || '',
          profileImage: user.profileImage || '',
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        assignedLawyer,
        upcomingAppointment,
        notifications,
        documents,
        stats: {
          totalAppointments: appointments.length,
          totalDocuments: documents.length,
          unreadNotifications: notifications.filter((n) => !n.isRead).length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Client Profile
// @route   GET /api/client/profile
// @access  Private (Client)
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        role: user.role,
        assignedLawyerId: user.assignedLawyerId || null,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Client Profile (Permitted fields only)
// @route   PATCH /api/client/profile
// @access  Private (Client)
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, bio } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    // Explicit field whitelist: NEVER allow role, email, assignedLawyerId, isActive mutations
    const updatePayload = {
      fullName: fullName.trim(),
      phone: phone !== undefined ? phone.trim() : '',
      bio: bio !== undefined ? bio.trim() : '',
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatePayload, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        bio: updatedUser.bio || '',
        profileImage: updatedUser.profileImage || '',
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Profile Picture
// @route   POST /api/client/profile-image
// @access  Private (Client)
export const uploadProfileImage = async (req, res, next) => {
  try {
    const validation = validateImageFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const fileResult = await uploadFile(req.file, 'avatars');

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: fileResult.fileUrl },
      { new: true }
    );

    // Record system notification for user action
    await Notification.create({
      client: req.user._id,
      title: 'Profile Picture Updated',
      message: 'Your profile picture was successfully uploaded and updated.',
      type: 'info',
    });

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profileImage: fileResult.fileUrl,
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Client Appointments
// @route   GET /api/client/appointments
// @access  Private (Client)
export const getAppointments = async (req, res, next) => {
  try {
    const rawAppointments = await Appointment.find({ client: req.user._id });
    const appointments = Array.isArray(rawAppointments) ? rawAppointments : [];

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request/Create Appointment
// @route   POST /api/client/appointments
// @access  Private (Client)
export const createAppointment = async (req, res, next) => {
  try {
    const { title, appointmentType, appointmentDate, appointmentTime, notes } = req.body;

    if (!title || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide appointment title, date, and time',
      });
    }

    const appointment = await Appointment.create({
      client: req.user._id,
      lawyer: req.user.assignedLawyerId || null,
      title: title.trim(),
      appointmentType: appointmentType ? appointmentType.trim() : 'General Legal Consultation',
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      notes: notes ? notes.trim() : '',
      status: 'pending',
    });

    // Create system notification
    await Notification.create({
      client: req.user._id,
      title: 'Appointment Requested',
      message: `Your consultation request "${appointment.title}" for ${appointment.appointmentDate} at ${appointment.appointmentTime} has been submitted.`,
      type: 'appointment',
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Client Notifications
// @route   GET /api/client/notifications
// @access  Private (Client)
export const getNotifications = async (req, res, next) => {
  try {
    const rawNotifications = await Notification.find({ client: req.user._id });
    const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/client/notifications/:id/read
// @access  Private (Client)
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.markAsRead(id, req.user._id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or access denied',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/client/notifications/read-all
// @access  Private (Client)
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.markAllAsRead(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Client Legal Documents
// @route   GET /api/client/documents
// @access  Private (Client)
export const getDocuments = async (req, res, next) => {
  try {
    const rawDocuments = await Document.find({ client: req.user._id });
    const documents = Array.isArray(rawDocuments) ? rawDocuments : [];

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload Legal Document
// @route   POST /api/client/documents
// @access  Private (Client)
export const uploadDocument = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }

    const validation = validateDocumentFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const fileResult = await uploadFile(req.file, 'documents');

    const documentDoc = await Document.create({
      client: req.user._id,
      title: title.trim(),
      filename: fileResult.filename,
      fileUrl: fileResult.fileUrl,
      fileKey: fileResult.fileKey,
      fileType: fileResult.fileType,
      fileSize: fileResult.fileSize,
      uploadedBy: 'client',
      status: 'active',
    });

    // Create system notification
    await Notification.create({
      client: req.user._id,
      title: 'Legal Document Uploaded',
      message: `Document "${documentDoc.title}" was successfully uploaded to your secure vault.`,
      type: 'document',
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: documentDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / Securely Stream Legal Document
// @route   GET /api/client/documents/:id/download
// @access  Private (Client - Strict Authorization Enforced)
export const downloadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const documentDoc = await Document.findById(id);

    if (!documentDoc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // STRICT SERVER-SIDE AUTHORIZATION CHECK
    if (documentDoc.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not authorized to view or download this document.',
      });
    }

    // Serve local file if available
    const relativePath = documentDoc.fileUrl.replace(/^\//, '');
    const absoluteFilePath = path.resolve(relativePath);

    if (fs.existsSync(absoluteFilePath)) {
      return res.download(absoluteFilePath, documentDoc.filename);
    }

    // Return document URL metadata
    return res.status(200).json({
      success: true,
      document: documentDoc,
      downloadUrl: documentDoc.fileUrl,
    });
  } catch (error) {
    next(error);
  }
};
