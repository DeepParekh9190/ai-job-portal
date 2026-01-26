import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Generate JWT Access Token
 * @param {String} id - User/Client ID
 * @param {String} role - User role (user, client, admin)
 * @returns {String} - JWT token
 */
export const generateAccessToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/**
 * Generate Refresh Token (for future implementation)
 * @param {String} id - User/Client ID
 * @returns {String} - Refresh token
 */
export const generateRefreshToken = (id) => {
  return jwt.sign(
    { id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );
};

/**
 * Generate Email Verification Token
 * @returns {String} - Random verification token
 */
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate Password Reset Token
 * @returns {Object} - Token and hashed token
 */
export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token before storing in database
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return {
    resetToken,
    hashedToken
  };
};

/**
 * Generate complete auth response with token
 * @param {Object} user - User or Client object
 * @param {Number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Generate token
  const token = generateAccessToken(user._id, user.role);

  // Remove sensitive data
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;
  delete userObj.emailVerificationToken;

  // Send response
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {String} token - JWT token
 * @returns {Object} - Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param {String} token - JWT token
 * @returns {Boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

/**
 * Generate API key for external integrations (future use)
 * @returns {String} - API key
 */
export const generateApiKey = () => {
  return `sk_${crypto.randomBytes(32).toString('hex')}`;
};

/**
 * Hash API key for storage
 * @param {String} apiKey - API key to hash
 * @returns {String} - Hashed API key
 */
export const hashApiKey = (apiKey) => {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
};

/**
 * Generate temporary access token (short-lived)
 * @param {String} id - User/Client ID
 * @param {String} purpose - Token purpose
 * @returns {String} - Short-lived token
 */
export const generateTempToken = (id, purpose) => {
  return jwt.sign(
    { id, purpose },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Create token cookie options
 * @returns {Object} - Cookie options
 */
export const getCookieOptions = () => {
  return {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateResetToken,
  sendTokenResponse,
  verifyAccessToken,
  decodeToken,
  isTokenExpired,
  generateApiKey,
  hashApiKey,
  generateTempToken,
  getCookieOptions
};