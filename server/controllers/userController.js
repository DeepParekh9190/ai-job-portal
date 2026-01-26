import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Client from '../models/Client.js';
import { calculateJobMatch } from '../utils/jobMatcher.js';

/**
 * @desc    Apply for a job
 * @route   POST /api/user/jobs/:id/apply
 * @access  Private (User only)
 */
export const applyForJob = async (req, res) => {
  try {
    const userId = req.userId;
    const jobId = req.params.id;
    const { 
      coverLetter, 
      resumeId, 
      expectedSalary,
      availability 
    } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active' || job.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId,
      applicationType: 'job'
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Get resume
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
      if (!resume || resume.user.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid resume'
        });
      }
    }

    // Get user profile for AI matching
    const user = await User.findById(userId);

    // Calculate AI match score
    let aiAnalysis;
    try {
      aiAnalysis = await calculateJobMatch(user, job);
    } catch (error) {
      console.error('AI Match Error:', error);
      // Continue without AI analysis if it fails
      aiAnalysis = { overallScore: null };
    }

    // Create application
    const application = await Application.create({
      user: userId,
      job: jobId,
      gig: null,
      applicationType: 'job',
      client: job.client,
      coverLetter,
      resume: resume ? {
        type: resume.type,
        url: resume.file?.url,
        filename: resume.file?.filename,
        content: resume.type === 'ai-generated' ? JSON.stringify(resume) : null
      } : null,
      expectedSalary,
      availability,
      aiAnalysis,
      status: 'submitted',
      submittedAt: new Date()
    });

    // Update job stats
    await job.incrementApplications();

    // Update user stats
    user.totalApplications = (user.totalApplications || 0) + 1;
    await user.save();

    // Update resume stats
    if (resume) {
      resume.stats.applicationsUsed += 1;
      resume.lastUsed = new Date();
      await resume.save();
    }

    // Update client stats
    await Client.findByIdAndUpdate(job.client, {
      $inc: { 'stats.totalApplicationsReceived': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
      matchScore: aiAnalysis?.overallScore
    });
  } catch (error) {
    console.error('Apply for Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
};

/**
 * @desc    Apply for a gig
 * @route   POST /api/user/gigs/:id/apply
 * @access  Private (User only)
 */
export const applyForGig = async (req, res) => {
  try {
    const userId = req.userId;
    const gigId = req.params.id;
    const {
      coverLetter,
      resumeId,
      bidAmount,
      proposedDuration,
      portfolio
    } = req.body;

    // Check if gig exists and is active
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status !== 'active' || gig.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This gig is not accepting proposals'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      user: userId,
      gig: gigId,
      applicationType: 'gig'
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this gig'
      });
    }

    // Get resume
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
      if (!resume || resume.user.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid resume'
        });
      }
    }

    // Get user profile for AI matching
    const user = await User.findById(userId);

    // Calculate AI match score
    let aiAnalysis;
    try {
      // Convert gig to job-like format for matching
      const gigAsJob = {
        title: gig.title,
        requirements: {
          skills: gig.skills,
          experience: { min: gig.experienceLevel === 'entry' ? 0 : gig.experienceLevel === 'intermediate' ? 2 : 5 }
        }
      };
      aiAnalysis = await calculateJobMatch(user, gigAsJob);
    } catch (error) {
      console.error('AI Match Error:', error);
      aiAnalysis = { overallScore: null };
    }

    // Create application (proposal)
    const application = await Application.create({
      user: userId,
      gig: gigId,
      job: null,
      applicationType: 'gig',
      client: gig.client,
      coverLetter,
      resume: resume ? {
        type: resume.type,
        url: resume.file?.url,
        filename: resume.file?.filename
      } : null,
      bidAmount,
      portfolio,
      aiAnalysis,
      status: 'submitted',
      submittedAt: new Date()
    });

    // Update gig stats
    await gig.incrementProposals();

    // Update user stats
    user.totalApplications = (user.totalApplications || 0) + 1;
    await user.save();

    // Update resume stats
    if (resume) {
      resume.stats.applicationsUsed += 1;
      resume.lastUsed = new Date();
      await resume.save();
    }

    // Update client stats
    await Client.findByIdAndUpdate(gig.client, {
      $inc: { 'stats.totalApplicationsReceived': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully',
      application,
      matchScore: aiAnalysis?.overallScore
    });
  } catch (error) {
    console.error('Apply for Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting proposal',
      error: error.message
    });
  }
};

/**
 * @desc    Get user's applications
 * @route   GET /api/user/applications
 * @access  Private (User only)
 */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const { 
      type, 
      status, 
      page = 1, 
      limit = 10,
      sort = '-submittedAt'
    } = req.query;

    // Build query
    const query = { user: userId };
    if (type) query.applicationType = type;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get applications
    const applications = await Application.find(query)
      .populate('job', 'title company location salary status')
      .populate('gig', 'title budget duration status')
      .populate('client', 'name company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get statistics
    const stats = await Application.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user object for stats aggregation
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      stats: stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
};

/**
 * @desc    Withdraw application
 * @route   PUT /api/user/applications/:id/withdraw
 * @access  Private (User only)
 */
export const withdrawApplication = async (req, res) => {
  try {
    const userId = req.userId;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check ownership
    if (application.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if can be withdrawn
    if (['accepted', 'rejected'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw an application that is ${application.status}`
      });
    }

    await application.updateStatus('withdrawn', userId, 'User', 'Application withdrawn by user');

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      application
    });
  } catch (error) {
    console.error('Withdraw Application Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error withdrawing application',
      error: error.message
    });
  }
};

/**
 * @desc    Accept job offer
 * @route   PUT /api/user/applications/:id/accept-offer
 * @access  Private (User only)
 */
export const acceptOffer = async (req, res) => {
  try {
    const userId = req.userId;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (application.status !== 'offered') {
      return res.status(400).json({
        success: false,
        message: 'No offer available to accept'
      });
    }

    // Check if offer expired
    if (application.offerDetails?.expiresAt && new Date() > application.offerDetails.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Offer has expired'
      });
    }

    application.offerDetails.acceptedAt = new Date();
    await application.updateStatus('accepted', userId, 'User', 'Offer accepted');

    // Update job/gig stats
    if (application.applicationType === 'job') {
      await Job.findByIdAndUpdate(application.job, {
        $inc: { 'stats.hired': 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer accepted successfully',
      application
    });
  } catch (error) {
    console.error('Accept Offer Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting offer',
      error: error.message
    });
  }
};

/**
 * @desc    Decline job offer
 * @route   PUT /api/user/applications/:id/decline-offer
 * @access  Private (User only)
 */
export const declineOffer = async (req, res) => {
  try {
    const userId = req.userId;
    const applicationId = req.params.id;
    const { reason } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (application.status !== 'offered') {
      return res.status(400).json({
        success: false,
        message: 'No offer available to decline'
      });
    }

    application.offerDetails.declinedAt = new Date();
    application.offerDetails.declineReason = reason;
    await application.updateStatus('rejected', userId, 'User', `Offer declined: ${reason || 'No reason provided'}`);

    res.status(200).json({
      success: true,
      message: 'Offer declined',
      application
    });
  } catch (error) {
    console.error('Decline Offer Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error declining offer',
      error: error.message
    });
  }
};

/**
 * @desc    Get user dashboard data
 * @route   GET /api/user/dashboard
 * @access  Private (User only)
 */
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user profile
    const user = await User.findById(userId);

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent applications
    const recentApplications = await Application.find({ user: userId })
      .populate('job', 'title company location')
      .populate('gig', 'title budget')
      .populate('client', 'name company')
      .sort('-submittedAt')
      .limit(5);

    // Get resume statistics
    const resumeCount = await Resume.countDocuments({ user: userId, isActive: true });
    const primaryResume = await Resume.findOne({ user: userId, isPrimary: true });

    // Get application response rate
    const totalApplications = await Application.countDocuments({ user: userId });
    const respondedApplications = await Application.countDocuments({
      user: userId,
      status: { $in: ['interview', 'offered', 'accepted', 'rejected'] }
    });
    const responseRate = totalApplications > 0 
      ? Math.round((respondedApplications / totalApplications) * 100) 
      : 0;

    // Get average match score
    const avgMatchResult = await Application.aggregate([
      { $match: { user: user._id, 'aiAnalysis.overallScore': { $exists: true } } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$aiAnalysis.overallScore' }
        }
      }
    ]);
    const averageMatchScore = avgMatchResult.length > 0 
      ? Math.round(avgMatchResult[0].avgScore) 
      : 0;

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          name: user.name,
          email: user.email,
          title: user.professional?.title,
          experience: user.professional?.experience,
          completeness: primaryResume?.completionPercentage || 0
        },
        stats: {
          totalApplications,
          responseRate,
          averageMatchScore,
          resumeCount,
          applicationBreakdown: applicationStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        },
        recentApplications,
        primaryResume: primaryResume ? {
          id: primaryResume._id,
          title: primaryResume.title,
          score: primaryResume.analysis?.overallScore,
          lastAnalyzed: primaryResume.lastAnalyzed
        } : null
      }
    });
  } catch (error) {
    console.error('Get Dashboard Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
};

export default {
  applyForJob,
  applyForGig,
  getMyApplications,
  withdrawApplication,
  acceptOffer,
  declineOffer,
  getUserDashboard
};