import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { getJwtSecret } from '../utils/getJwtSecret.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for HTTP-only cookie or Bearer token header
  if (req.cookies && req.cookies.apex_token) {
    token = req.cookies.apex_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User account no longer exists' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'User account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'JWT_SECRET environment variable is missing') {
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }
    console.error('[Auth Middleware Error]:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

export const authenticateUser = protect;
export const requireRole = (...roles) => authorize(...roles);

