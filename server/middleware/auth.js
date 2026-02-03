import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Client from '../models/Client.js';

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on role
    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'client') {
      user = await Client.findById(decoded.id).select('-password');
    } else if (decoded.role === 'admin') {
      user = await User.findById(decoded.id).select('-password');
    } else {
      // Fallback for older tokens missing role - search both models
      user = await User.findById(decoded.id).select('-password');
      if (!user) {
        user = await Client.findById(decoded.id).select('-password');
      }
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists. Please login again.'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role; // Use the role from the resolved user record

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Allows access but attaches user if token is valid
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.role === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.role === 'client') {
      user = await Client.findById(decoded.id).select('-password');
    }

    if (user && user.isActive) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }

  next();
};

/**
 * Verify Email Token Middleware
 * Used for email verification routes
 */
export const verifyEmailToken = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Verification token is required'
    });
  }

  try {
    // Find user with this verification token
    const user = await User.findOne({ emailVerificationToken: token });
    const client = await Client.findOne({ emailVerificationToken: token });

    const account = user || client;

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    req.account = account;
    next();
  } catch (error) {
    console.error('Email Verification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying email'
    });
  }
};

/**
 * Check if user owns the resource
 * Prevents users from accessing other users' data
 */
export const authorize = (resourceUserIdField = 'user') => {
  return (req, res, next) => {
    // Get resource from request (should be set by previous middleware)
    const resource = req.resource;

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user owns the resource
    const resourceUserId = resource[resourceUserIdField]?.toString() || resource[resourceUserIdField];
    const requestUserId = req.userId.toString();

    if (resourceUserId !== requestUserId && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests
 */
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }

    const userRequests = requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    validRequests.push(now);
    requests.set(identifier, validRequests);

    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of requests.entries()) {
        if (value.length === 0 || now - value[value.length - 1] > windowMs) {
          requests.delete(key);
        }
      }
    }

    next();
  };
};

export default protect;