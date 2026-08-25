import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { verifyCaptcha } from '../utils/verifyCaptcha.js';
import { sendResetPasswordEmail } from '../services/email.service.js';

const generateTokenAndSetCookie = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'apex_legal_fallback_dev_secret_2026';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });

  res.cookie('apex_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword, captchaToken } = req.body;

    // Verify CAPTCHA
    const captchaRes = await verifyCaptcha(captchaToken, req.ip);
    if (!captchaRes.success) {
      return res.status(400).json({ success: false, message: captchaRes.message });
    }

    // Input Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists' });
    }

    // Hash Password
    const passwordHash = await User.hashPassword(password);

    // Create User (Role strictly enforced to 'client')
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'client',
    });

    // Generate Token and Cookie
    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Verify CAPTCHA
    const captchaRes = await verifyCaptcha(captchaToken, req.ip);
    if (!captchaRes.success) {
      return res.status(400).json({ success: false, message: captchaRes.message });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user and include passwordHash for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    // Generic error message to prevent user enumeration
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
    }

    // Generate Token and Cookie
    generateTokenAndSetCookie(res, user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.cookie('apex_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Initiate password reset flow
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email, captchaToken } = req.body;

    const captchaRes = await verifyCaptcha(captchaToken, req.ip);
    if (!captchaRes.success) {
      return res.status(400).json({ success: false, message: captchaRes.message });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return neutral message regardless of account existence
    const neutralResponse = {
      success: true,
      message: 'If an account exists for this email, password reset instructions have been sent.',
    };

    if (!user) {
      return res.status(200).json(neutralResponse);
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token to store in database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Reset URL pointing to client frontend
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail({ to: user.email, resetUrl });

    return res.status(200).json(neutralResponse);
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword, captchaToken } = req.body;

    const captchaRes = await verifyCaptcha(captchaToken, req.ip);
    if (!captchaRes.success) {
      return res.status(400).json({ success: false, message: captchaRes.message });
    }

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    // Hash token from request to query DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Update password and clear token
    user.passwordHash = await User.hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful. You may now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
