import express from 'express';
import {
  registerUser,
  registerClient,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public Routes

/**
 * @route   POST /api/auth/register/user
 * @desc    Register new user (Job Seeker)
 * @access  Public
 */
router.post('/register/user', registerUser);

/**
 * @route   POST /api/auth/register/client
 * @desc    Register new client (Employer)
 * @access  Public
 */
router.post('/register/client', registerClient);

/**
 * @route   POST /api/auth/login
 * @desc    Login user or client
 * @access  Public
 * @body    { email, password, role? }
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   PUT /api/auth/reset-password/:resetToken
 * @desc    Reset password using token
 * @access  Public
 * @body    { newPassword }
 */
router.put('/reset-password/:resetToken', resetPassword);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

// Protected Routes (Require Authentication)

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user/client
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user/client profile
 * @access  Private
 * @body    Profile fields to update
 */
router.put('/update-profile', protect, updateProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password
 * @access  Private
 * @body    { currentPassword, newPassword }
 */
router.put('/change-password', protect, changePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

export default router;