import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import {
  getAllUsers,
  getAllClients,
  getUserById,
  getClientById,
  updateUserStatus,
  updateClientStatus,
  verifyClient,
  getAllJobsForApproval,
  getAllGigsForApproval,
  approveJob,
  approveGig,
  getAnalytics,
  deleteUser,
  deleteClient
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// ==================== USER MANAGEMENT ====================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Private (Admin only)
 * @query   search, isActive, isEmailVerified, page, limit, sort
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID with statistics
 * @access  Private (Admin only)
 */
router.get('/users/:id', getUserById);

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Activate/Deactivate user
 * @access  Private (Admin only)
 * @body    { isActive }
 */
router.put('/users/:id/status', updateUserStatus);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user permanently
 * @access  Private (Admin only)
 */
router.delete('/users/:id', deleteUser);

// ==================== CLIENT MANAGEMENT ====================

/**
 * @route   GET /api/admin/clients
 * @desc    Get all clients with filters
 * @access  Private (Admin only)
 * @query   search, isActive, isVerified, verificationStatus, page, limit, sort
 */
router.get('/clients', getAllClients);

/**
 * @route   GET /api/admin/clients/:id
 * @desc    Get client by ID with statistics
 * @access  Private (Admin only)
 */
router.get('/clients/:id', getClientById);

/**
 * @route   PUT /api/admin/clients/:id/status
 * @desc    Activate/Deactivate client
 * @access  Private (Admin only)
 * @body    { isActive }
 */
router.put('/clients/:id/status', updateClientStatus);

/**
 * @route   PUT /api/admin/clients/:id/verify
 * @desc    Verify/Reject client company
 * @access  Private (Admin only)
 * @body    { verificationStatus, rejectionReason? }
 */
router.put('/clients/:id/verify', verifyClient);

/**
 * @route   DELETE /api/admin/clients/:id
 * @desc    Delete client permanently
 * @access  Private (Admin only)
 */
router.delete('/clients/:id', deleteClient);

// ==================== JOB/GIG APPROVAL ====================

/**
 * @route   GET /api/admin/jobs
 * @desc    Get all jobs for approval
 * @access  Private (Admin only)
 * @query   approvalStatus, status, page, limit, sort
 */
router.get('/jobs', getAllJobsForApproval);

/**
 * @route   PUT /api/admin/jobs/:id/approve
 * @desc    Approve/Reject job posting
 * @access  Private (Admin only)
 * @body    { approvalStatus, rejectionReason? }
 */
router.put('/jobs/:id/approve', approveJob);

/**
 * @route   GET /api/admin/gigs
 * @desc    Get all gigs for approval
 * @access  Private (Admin only)
 * @query   approvalStatus, status, page, limit, sort
 */
router.get('/gigs', getAllGigsForApproval);

/**
 * @route   PUT /api/admin/gigs/:id/approve
 * @desc    Approve/Reject gig posting
 * @access  Private (Admin only)
 * @body    { approvalStatus, rejectionReason? }
 */
router.put('/gigs/:id/approve', approveGig);

// ==================== ANALYTICS ====================

/**
 * @route   GET /api/admin/analytics
 * @desc    Get platform-wide analytics and statistics
 * @access  Private (Admin only)
 */
router.get('/analytics', getAnalytics);

export default router;