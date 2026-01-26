import express from 'express';
import { protect } from '../middleware/auth.js';
import { clientOnly, checkJobPostingQuota } from '../middleware/roleCheck.js';
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobApplicants,
  closeJob,
  markJobFilled,
  getJobStats
} from '../controllers/jobController.js';
import {
  createGig,
  getMyGigs,
  updateGig,
  deleteGig,
  getGigProposals,
  assignGig,
  markGigCompleted,
  updateMilestone,
  getGigStats
} from '../controllers/gigController.js';

const router = express.Router();

// All routes require authentication and client role
router.use(protect, clientOnly);

// ==================== JOB ROUTES ====================

/**
 * @route   POST /api/client/jobs
 * @desc    Create new job posting
 * @access  Private (Client only)
 */
router.post('/jobs', checkJobPostingQuota, createJob);

/**
 * @route   GET /api/client/jobs
 * @desc    Get all jobs posted by client
 * @access  Private (Client only)
 * @query   status, page, limit
 */
router.get('/jobs', getMyJobs);

/**
 * @route   PUT /api/client/jobs/:id
 * @desc    Update job posting
 * @access  Private (Client only)
 */
router.put('/jobs/:id', updateJob);

/**
 * @route   DELETE /api/client/jobs/:id
 * @desc    Delete job posting
 * @access  Private (Client only)
 */
router.delete('/jobs/:id', deleteJob);

/**
 * @route   GET /api/client/jobs/:id/applicants
 * @desc    Get all applicants for a job
 * @access  Private (Client only)
 * @query   status, sortBy, page, limit
 */
router.get('/jobs/:id/applicants', getJobApplicants);

/**
 * @route   PUT /api/client/jobs/:id/close
 * @desc    Close job posting
 * @access  Private (Client only)
 */
router.put('/jobs/:id/close', closeJob);

/**
 * @route   PUT /api/client/jobs/:id/filled
 * @desc    Mark job as filled
 * @access  Private (Client only)
 */
router.put('/jobs/:id/filled', markJobFilled);

/**
 * @route   GET /api/client/jobs/:id/stats
 * @desc    Get job statistics
 * @access  Private (Client only)
 */
router.get('/jobs/:id/stats', getJobStats);

// ==================== GIG ROUTES ====================

/**
 * @route   POST /api/client/gigs
 * @desc    Create new gig posting
 * @access  Private (Client only)
 */
router.post('/gigs', createGig);

/**
 * @route   GET /api/client/gigs
 * @desc    Get all gigs posted by client
 * @access  Private (Client only)
 * @query   status, page, limit
 */
router.get('/gigs', getMyGigs);

/**
 * @route   PUT /api/client/gigs/:id
 * @desc    Update gig posting
 * @access  Private (Client only)
 */
router.put('/gigs/:id', updateGig);

/**
 * @route   DELETE /api/client/gigs/:id
 * @desc    Delete gig posting
 * @access  Private (Client only)
 */
router.delete('/gigs/:id', deleteGig);

/**
 * @route   GET /api/client/gigs/:id/proposals
 * @desc    Get all proposals for a gig
 * @access  Private (Client only)
 * @query   status, sortBy, page, limit
 */
router.get('/gigs/:id/proposals', getGigProposals);

/**
 * @route   PUT /api/client/gigs/:id/assign
 * @desc    Assign gig to freelancer
 * @access  Private (Client only)
 * @body    { userId }
 */
router.put('/gigs/:id/assign', assignGig);

/**
 * @route   PUT /api/client/gigs/:id/complete
 * @desc    Mark gig as completed
 * @access  Private (Client only)
 */
router.put('/gigs/:id/complete', markGigCompleted);

/**
 * @route   PUT /api/client/gigs/:id/milestones/:milestoneIndex
 * @desc    Update milestone status
 * @access  Private (Client only)
 * @body    { status }
 */
router.put('/gigs/:id/milestones/:milestoneIndex', updateMilestone);

/**
 * @route   GET /api/client/gigs/:id/stats
 * @desc    Get gig statistics
 * @access  Private (Client only)
 */
router.get('/gigs/:id/stats', getGigStats);

export default router;