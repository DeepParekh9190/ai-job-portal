import Job from '../models/Job.js';
import Client from '../models/Client.js';
import Application from '../models/Application.js';

/**
 * @desc    Create new job posting
 * @route   POST /api/client/jobs
 * @access  Private (Client only)
 */
export const createJob = async (req, res) => {
  try {
    const clientId = req.userId;

    // Check if client can post more jobs
    const client = await Client.findById(clientId);
    if (!client.canPostJob()) {
      return res.status(403).json({
        success: false,
        message: 'Job posting limit reached for your subscription plan',
        limit: client.subscription.jobPostingLimit,
        used: client.subscription.jobPostingsUsed
      });
    }

    // Create job
    const job = await Job.create({
      ...req.body,
      client: clientId,
      status: 'pending',
      approvalStatus: 'pending'
    });

    // Update client stats and quota
    client.subscription.jobPostingsUsed += 1;
    client.stats.totalJobsPosted += 1;
    client.stats.activeJobs += 1;
    await client.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully. Awaiting admin approval.',
      job
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
};

/**
 * @desc    Get all jobs (with filters)
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = async (req, res) => {
  try {
    const {
      category,
      jobType,
      location,
      minSalary,
      maxSalary,
      experienceLevel,
      keyword,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {
      status: 'active',
      approvalStatus: 'approved',
      applicationDeadline: { $gt: new Date() }
    };

    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (location) query['location.city'] = new RegExp(location, 'i');
    if (minSalary) query['salary.min'] = { $gte: parseInt(minSalary) };
    if (maxSalary) query['salary.max'] = { $lte: parseInt(maxSalary) };
    if (experienceLevel) {
      query['requirements.experience.min'] = { $lte: parseInt(experienceLevel) };
    }
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(query)
      .populate('client', 'name company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs
    });
  } catch (error) {
    console.error('Get All Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

/**
 * @desc    Get single job details
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name company email phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    await job.incrementViews();

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
};

/**
 * @desc    Get client's posted jobs
 * @route   GET /api/client/jobs
 * @access  Private (Client only)
 */
export const getMyJobs = async (req, res) => {
  try {
    const clientId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: clientId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs
    });
  } catch (error) {
    console.error('Get My Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your jobs',
      error: error.message
    });
  }
};

/**
 * @desc    Update job
 * @route   PUT /api/client/jobs/:id
 * @access  Private (Client only)
 */
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Don't allow updates to approved jobs without re-approval
    if (job.approvalStatus === 'approved') {
      req.body.approvalStatus = 'pending';
      req.body.status = 'pending';
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/client/jobs/:id
 * @access  Private (Client only)
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Soft delete - change status instead of removing
    job.status = 'closed';
    await job.save();

    // Update client stats
    const client = await Client.findById(req.userId);
    client.stats.activeJobs = Math.max(0, client.stats.activeJobs - 1);
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
};

/**
 * @desc    Get applicants for a job
 * @route   GET /api/client/jobs/:id/applicants
 * @access  Private (Client only)
 */
export const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status, sortBy = '-aiAnalysis.matchScore', page = 1, limit = 20 } = req.query;

    // Verify job ownership
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applicants'
      });
    }

    // Build query
    const query = { job: jobId, applicationType: 'job' };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get applicants
    const applications = await Application.find(query)
      .populate('user', 'name email phone profile professional')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get statistics
    const stats = await Application.aggregate([
      { $match: { job: job._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

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
    console.error('Get Job Applicants Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applicants',
      error: error.message
    });
  }
};

/**
 * @desc    Close job posting
 * @route   PUT /api/client/jobs/:id/close
 * @access  Private (Client only)
 */
export const closeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this job'
      });
    }

    job.status = 'closed';
    await job.save();

    // Update client stats
    const client = await Client.findById(req.userId);
    client.stats.activeJobs = Math.max(0, client.stats.activeJobs - 1);
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      job
    });
  } catch (error) {
    console.error('Close Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing job',
      error: error.message
    });
  }
};

/**
 * @desc    Mark job as filled
 * @route   PUT /api/client/jobs/:id/filled
 * @access  Private (Client only)
 */
export const markJobFilled = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    job.status = 'filled';
    job.stats.hired += 1;
    await job.save();

    // Update client stats
    const client = await Client.findById(req.userId);
    client.stats.totalHires += 1;
    client.stats.activeJobs = Math.max(0, client.stats.activeJobs - 1);
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Job marked as filled',
      job
    });
  } catch (error) {
    console.error('Mark Job Filled Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking job as filled',
      error: error.message
    });
  }
};

/**
 * @desc    Get job statistics
 * @route   GET /api/client/jobs/:id/stats
 * @access  Private (Client only)
 */
export const getJobStats = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get application statistics
    const applicationStats = await Application.aggregate([
      { $match: { job: job._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgMatchScore: { $avg: '$aiAnalysis.matchScore' }
        }
      }
    ]);

    // Get top applicants by match score
    const topApplicants = await Application.find({ job: jobId })
      .sort('-aiAnalysis.matchScore')
      .limit(5)
      .populate('user', 'name email professional.title professional.experience');

    res.status(200).json({
      success: true,
      stats: {
        views: job.stats.views,
        applications: job.stats.applications,
        shortlisted: job.stats.shortlisted,
        hired: job.stats.hired,
        applicationBreakdown: applicationStats,
        topApplicants
      }
    });
  } catch (error) {
    console.error('Get Job Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job statistics',
      error: error.message
    });
  }
};

export default {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobApplicants,
  closeJob,
  markJobFilled,
  getJobStats
};