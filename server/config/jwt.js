import jwt from 'jsonwebtoken';

/**
 * JWT Configuration and Utilities
 * Handles token generation, verification, and validation
 */

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key',
  expiresIn: process.env.JWT_EXPIRE || '30d',
  algorithm: 'HS256'
};

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token (userId, role, etc.)
 * @returns {String} - JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm
  });
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Decode JWT Token without verification (use for inspection only)
 * @param {String} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate token with custom expiration
 * @param {Object} payload - Data to encode
 * @param {String} expiresIn - Custom expiration (e.g., '1h', '7d')
 * @returns {String} - JWT token
 */
export const generateCustomToken = (payload, expiresIn) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn,
    algorithm: jwtConfig.algorithm
  });
};

export default jwtConfig;