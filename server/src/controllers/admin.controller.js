import User from '../models/user.model.js';
import Appointment from '../models/appointment.model.js';

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalLawyers = await User.countDocuments({ role: 'lawyer' });
    const totalAppointments = await Appointment.countDocuments({});
    
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: { $in: ['confirmed', 'approved'] } });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      stats: {
        totalClients,
        totalLawyers,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    let query = {};
    if (role) query.role = role;
    if (status !== undefined && status !== '') {
      query.isActive = status === 'true' || status === 'active';
    }
    if (search) query.search = search;

    const users = await User.find(query);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const appointments = await Appointment.find({ client: user._id });

    res.status(200).json({
      success: true,
      user,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean value' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['client', 'lawyer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    // Safety check against self demotion
    if (req.user._id.toString() === req.params.id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin status' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/lawyers
export const getLawyers = async (req, res, next) => {
  try {
    const lawyers = await User.find({ role: 'lawyer' });
    res.status(200).json({
      success: true,
      count: lawyers.length,
      lawyers,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/lawyers
export const createLawyer = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, bio, specialization, experienceYears, availabilityStatus } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Full name and email are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const passwordHash = await User.hashPassword(password || 'LawyerPass2026!');

    const lawyer = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'lawyer',
      phone: phone || '',
      bio: bio || '',
      specialization: specialization || 'General Practice',
      experienceYears: Number(experienceYears) || 0,
      availabilityStatus: availabilityStatus || 'available',
      isActive: true,
    });

    const lawyerDoc = lawyer.toObject ? lawyer.toObject() : { ...lawyer };
    delete lawyerDoc.passwordHash;

    res.status(201).json({
      success: true,
      message: 'Lawyer record created successfully',
      lawyer: lawyerDoc,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/lawyers/:id
export const updateLawyer = async (req, res, next) => {
  try {
    const { fullName, email, phone, bio, specialization, experienceYears, availabilityStatus, isActive } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
      }
    }

    const lawyer = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone,
        bio,
        specialization,
        experienceYears,
        availabilityStatus,
        isActive,
      },
      { new: true }
    );

    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lawyer profile updated successfully',
      lawyer,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/lawyers/:id
export const deactivateLawyer = async (req, res, next) => {
  try {
    const lawyer = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, availabilityStatus: 'on_leave' },
      { new: true }
    );

    if (!lawyer) {
      return res.status(404).json({ success: false, message: 'Lawyer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Lawyer deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/appointments
export const getAppointments = async (req, res, next) => {
  try {
    const { search, status, lawyerId, clientId, startDate, endDate } = req.query;

    let query = {};
    if (status) query.status = status;
    if (lawyerId) query.lawyer = lawyerId;
    if (clientId) query.client = clientId;
    if (search) query.search = search;
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;

    const appointments = await Appointment.find(query);

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/appointments/:id
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/appointments/:id/status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'confirmed', 'rescheduled', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status changed to ${status}`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/appointments/:id/assign-lawyer
export const assignLawyerToAppointment = async (req, res, next) => {
  try {
    const { lawyerId } = req.body;

    if (!lawyerId) {
      return res.status(400).json({ success: false, message: 'lawyerId is required' });
    }

    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.role !== 'lawyer') {
      return res.status(400).json({ success: false, message: 'Invalid lawyer record specified' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.appointmentDate && appointment.appointmentTime) {
      const isConflicted = await Appointment.checkConflict(
        lawyerId,
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment._id
      );
      if (isConflicted) {
        return res.status(400).json({
          success: false,
          message: 'Selected lawyer has an existing appointment conflict at this date and time slot.',
        });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(req.params.id, { lawyer: lawyerId }, { new: true });

    res.status(200).json({
      success: true,
      message: `Assigned lawyer ${lawyer.fullName} to appointment`,
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/appointments/:id/reschedule
export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({ success: false, message: 'Both appointmentDate and appointmentTime are required' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const lawyerId = appointment.lawyer ? (appointment.lawyer._id || appointment.lawyer) : null;
    if (lawyerId) {
      const isConflicted = await Appointment.checkConflict(
        lawyerId,
        appointmentDate,
        appointmentTime,
        appointment._id
      );
      if (isConflicted) {
        return res.status(400).json({
          success: false,
          message: 'The assigned lawyer is unavailable at the newly requested date and time slot.',
        });
      }
    }

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        appointmentDate,
        appointmentTime,
        status: 'rescheduled',
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment: updated,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/analytics
export const getAnalytics = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;

    let filterStart = null;
    const now = new Date();

    if (period === '7d') {
      filterStart = new Date(now.setDate(now.getDate() - 7));
    } else if (period === '30d') {
      filterStart = new Date(now.setDate(now.getDate() - 30));
    } else if (period === '90d') {
      filterStart = new Date(now.setDate(now.getDate() - 90));
    } else if (startDate) {
      filterStart = new Date(startDate);
    }

    const filterEnd = endDate ? new Date(endDate) : new Date();

    const users = await User.find({});
    const appointments = await Appointment.find({});

    const totalClients = users.filter((u) => u.role === 'client').length;
    const totalLawyers = users.filter((u) => u.role === 'lawyer').length;
    const totalAppointments = appointments.length;

    const statusBreakdown = {
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed' || a.status === 'approved').length,
      rescheduled: appointments.filter((a) => a.status === 'rescheduled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };

    let filteredAppointments = appointments;
    let filteredUsers = users;

    if (filterStart) {
      filteredAppointments = filteredAppointments.filter(
        (a) => new Date(a.createdAt || a.appointmentDate) >= filterStart && new Date(a.createdAt || a.appointmentDate) <= filterEnd
      );
      filteredUsers = filteredUsers.filter(
        (u) => new Date(u.createdAt) >= filterStart && new Date(u.createdAt) <= filterEnd
      );
    }

    const appointmentTrendsMap = {};
    filteredAppointments.forEach((a) => {
      const dateKey = (a.appointmentDate || a.createdAt || '').substring(0, 10);
      if (dateKey) {
        appointmentTrendsMap[dateKey] = (appointmentTrendsMap[dateKey] || 0) + 1;
      }
    });

    const userTrendsMap = {};
    filteredUsers.forEach((u) => {
      const dateKey = u.createdAt ? new Date(u.createdAt).toISOString().substring(0, 10) : '';
      if (dateKey) {
        userTrendsMap[dateKey] = (userTrendsMap[dateKey] || 0) + 1;
      }
    });

    const appointmentTrends = Object.keys(appointmentTrendsMap)
      .sort()
      .map((date) => ({ date, count: appointmentTrendsMap[date] }));

    const userRegistrationTrends = Object.keys(userTrendsMap)
      .sort()
      .map((date) => ({ date, count: userTrendsMap[date] }));

    res.status(200).json({
      success: true,
      analytics: {
        totalClients,
        totalLawyers,
        totalAppointments,
        statusBreakdown,
        appointmentTrends,
        userRegistrationTrends,
        filterPeriod: period || 'all',
      },
    });
  } catch (error) {
    next(error);
  }
};
