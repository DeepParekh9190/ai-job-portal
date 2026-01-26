import express from 'express';
import { protect } from '../middleware/auth.js';
import { userOnly } from '../middleware/roleCheck.js';
import {
  applyForJob,
  applyForGig,
  getMyApplications,
  withdrawApplication,
  acceptOffer,
  declineOffer,
  getUserDashboard
} from '../controllers/userController.js';
import { getAllJobs, getJobById } from '../controllers/jobController.js';
import { getAllGigs, getGigById } from '../controllers/gigController.js';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/user/jobs
 * @desc    Browse all available jobs
 * @access  Public
 * @query   category, jobType, location, minSalary, maxSalary, experienceLevel, keyword, page, limit, sort
 */
router.get('/jobs', getAllJobs);

/**
 * @route   GET /api/user/jobs/:id
 * @desc    Get single job details
 * @access  Public
 */
router.get('/jobs/:id', getJobById);

/**
 * @route   GET /api/user/gigs
 * @desc    Browse all available gigs
 * @access  Public
 * @query   category, experienceLevel, budgetMin, budgetMax, scope, location, keyword, page, limit, sort
 */
router.get('/gigs', getAllGigs);

/**
 * @route   GET /api/user/gigs/:id
 * @desc    Get single gig details
 * @access  Public
 */
router.get('/gigs/:id', getGigById);

// ==================== PROTECTED ROUTES (User only) ====================

router.use(protect, userOnly);

/**
 * @route   GET /api/user/dashboard
 * @desc    Get user dashboard data
 * @access  Private (User only)
 */
router.get('/dashboard', getUserDashboard);

/**
 * @route   POST /api/user/jobs/:id/apply
 * @desc    Apply for a job
 * @access  Private (User only)
 * @body    { coverLetter, resumeId, expectedSalary, availability }
 */
router.post('/jobs/:id/apply', applyForJob);

/**
 * @route   POST /api/user/gigs/:id/apply
 * @desc    Apply for a gig (submit proposal)
 * @access  Private (User only)
 * @body    { coverLetter, resumeId, bidAmount, proposedDuration }
 */
router.post('/gigs/:id/apply', applyForGig);

/**
 * @route   GET /api/user/applications
 * @desc    Get all user's applications
 * @access  Private (User only)
 * @query   type (job/gig), status, page, limit
 */
router.get('/applications', getMyApplications);

/**
 * @route   PUT /api/user/applications/:id/withdraw
 * @desc    Withdraw application
 * @access  Private (User only)
 */
router.put('/applications/:id/withdraw', withdrawApplication);

/**
 * @route   PUT /api/user/applications/:id/accept-offer
 * @desc    Accept job offer
 * @access  Private (User only)
 */
router.put('/applications/:id/accept-offer', acceptOffer);

/**
 * @route   PUT /api/user/applications/:id/decline-offer
 * @desc    Decline job offer
 * @access  Private (User only)
 * @body    { reason }
 */
router.put('/applications/:id/decline-offer', declineOffer);

export default router;