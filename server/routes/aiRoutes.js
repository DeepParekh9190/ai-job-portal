import express from 'express';
import { protect } from '../middleware/auth.js';
import { userOnly } from '../middleware/roleCheck.js';
import {
  generateAIResume,
  analyzeResumeAI,
  calculateMatch,
  getRecommendedJobs,
  generateSummary,
  generateJobDesc,
  improveSection,
  generateCoverLetterAI,
  getKeywordSuggestions,
  getSkillRecommendations
} from '../controllers/aiController.js';

const router = express.Router();

// All AI routes require authentication and user role
router.use(protect, userOnly);

// ==================== RESUME AI FEATURES ====================

/**
 * @route   POST /api/ai/generate-resume
 * @desc    Generate complete resume using AI
 * @access  Private (User only)
 * @body    { name, email, phone, jobTitle, summary, experience, education, skills }
 */
router.post('/generate-resume', generateAIResume);

/**
 * @route   POST /api/ai/analyze-resume
 * @desc    Analyze resume and provide detailed feedback
 * @access  Private (User only)
 * @body    { resumeId?, resumeText? }
 */
router.post('/analyze-resume', analyzeResumeAI);

/**
 * @route   POST /api/ai/generate-summary
 * @desc    Generate professional summary
 * @access  Private (User only)
 * @body    { title, experience, skills, industry }
 */
router.post('/generate-summary', generateSummary);

/**
 * @route   POST /api/ai/generate-job-description
 * @desc    Generate job description bullet points
 * @access  Private (User only)
 * @body    { title, company, responsibilities, skills }
 */
router.post('/generate-job-description', generateJobDesc);

/**
 * @route   POST /api/ai/improve-section
 * @desc    Improve specific resume section
 * @access  Private (User only)
 * @body    { sectionName, content }
 */
router.post('/improve-section', improveSection);

/**
 * @route   POST /api/ai/suggest-keywords
 * @desc    Get keyword suggestions for industry
 * @access  Private (User only)
 * @body    { industry, jobTitle }
 */
router.post('/suggest-keywords', getKeywordSuggestions);

// ==================== JOB MATCHING AI FEATURES ====================

/**
 * @route   POST /api/ai/match-job
 * @desc    Calculate match score for specific job
 * @access  Private (User only)
 * @body    { jobId }
 */
router.post('/match-job', calculateMatch);

/**
 * @route   GET /api/ai/recommended-jobs
 * @desc    Get personalized job recommendations
 * @access  Private (User only)
 * @query   limit (default: 10)
 */
router.get('/recommended-jobs', getRecommendedJobs);

/**
 * @route   GET /api/ai/recommend-skills
 * @desc    Get skill learning recommendations
 * @access  Private (User only)
 */
router.get('/recommend-skills', getSkillRecommendations);

// ==================== COVER LETTER AI FEATURES ====================

/**
 * @route   POST /api/ai/generate-cover-letter
 * @desc    Generate customized cover letter for job
 * @access  Private (User only)
 * @body    { jobId }
 */
router.post('/generate-cover-letter', generateCoverLetterAI);

export default router;