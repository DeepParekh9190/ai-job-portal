import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Gig from '../models/Gig.js';
import User from '../models/User.js';
import { calculateJobMatch } from '../utils/jobMatcher.js';

/**
 * @desc    Update application status
 * @route   PUT /api/client/applications/:id/status
 * @access  Private (Client only)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if client owns the job/gig
    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status with history
    await application.updateStatus(status, req.userId, 'Client', note);

    // Update job/gig stats
    if (status === 'shortlisted') {
      if (application.applicationType === 'job') {
        await Job.findByIdAndUpdate(application.job, {
          $inc: { 'stats.shortlisted': 1 }
        });
      } else {
        await Gig.findByIdAndUpdate(application.gig, {
          $inc: { 'stats.shortlisted': 1 }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message
    });
  }
};

/**
 * @desc    Add notes to application
 * @route   PUT /api/client/applications/:id/notes
 * @access  Private (Client only)
 */
export const addApplicationNotes = async (req, res) => {
  try {
    const { notes, rating } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.clientNotes = notes;
    if (rating) application.clientRating = rating;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Notes added successfully',
      application
    });
  } catch (error) {
    console.error('Add Notes Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding notes',
      error: error.message
    });
  }
};

/**
 * @desc    Schedule interview
 * @route   PUT /api/client/applications/:id/interview
 * @access  Private (Client only)
 */
export const scheduleInterview = async (req, res) => {
  try {
    const { date, time, type, meetingLink, location, notes } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.interview = {
      scheduled: true,
      date,
      time,
      type,
      meetingLink,
      location,
      notes,
      completed: false
    };
    
    await application.updateStatus('interview', req.userId, 'Client', 'Interview scheduled');

    // TODO: Send interview notification email

    res.status(200).json({
      success: true,
      message: 'Interview scheduled successfully',
      application
    });
  } catch (error) {
    console.error('Schedule Interview Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    });
  }
};

/**
 * @desc    Mark interview as completed
 * @route   PUT /api/client/applications/:id/interview/complete
 * @access  Private (Client only)
 */
export const completeInterview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.interview.completed = true;
    application.interview.feedback = feedback;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Interview marked as completed',
      application
    });
  } catch (error) {
    console.error('Complete Interview Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing interview',
      error: error.message
    });
  }
};

/**
 * @desc    Send job offer
 * @route   PUT /api/client/applications/:id/offer
 * @access  Private (Client only)
 */
export const sendOffer = async (req, res) => {
  try {
    const { 
      salary, 
      startDate, 
      benefits, 
      offerLetter, 
      expiresAt 
    } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.offerDetails = {
      salary,
      startDate,
      benefits,
      offerLetter,
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    await application.updateStatus('offered', req.userId, 'Client', 'Offer sent');

    // TODO: Send offer notification email

    res.status(200).json({
      success: true,
      message: 'Offer sent successfully',
      application
    });
  } catch (error) {
    console.error('Send Offer Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending offer',
      error: error.message
    });
  }
};

/**
 * @desc    Reject application
 * @route   PUT /api/client/applications/:id/reject
 * @access  Private (Client only)
 */
export const rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.rejectionReason = reason;
    application.rejectedAt = new Date();
    await application.updateStatus('rejected', req.userId, 'Client', reason);

    // TODO: Send rejection notification (optional)

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      application
    });
  } catch (error) {
    console.error('Reject Application Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting application',
      error: error.message
    });
  }
};

/**
 * @desc    Get single application details
 * @route   GET /api/applications/:id
 * @access  Private (Client or User)
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('user', 'name email phone profile professional')
      .populate('client', 'name company email phone')
      .populate('job', 'title company location salary')
      .populate('gig', 'title budget duration');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const isOwner = application.user._id.toString() === req.userId;
    const isClient = application.client._id.toString() === req.userId;
    
    if (!isOwner && !isClient && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    // Mark as viewed by client
    if (isClient && !application.viewedByClient) {
      await application.markAsViewed();
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get Application Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message
    });
  }
};

/**
 * @desc    Compare multiple applications
 * @route   POST /api/client/applications/compare
 * @access  Private (Client only)
 */
export const compareApplications = async (req, res) => {
  try {
    const { applicationIds } = req.body;

    if (!applicationIds || applicationIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 application IDs to compare'
      });
    }

    const applications = await Application.find({
      _id: { $in: applicationIds },
      client: req.userId
    }).populate('user', 'name email professional');

    if (applications.length !== applicationIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some applications not found or not authorized'
      });
    }

    // Create comparison
    const comparison = applications.map(app => ({
      applicationId: app._id,
      candidateName: app.user.name,
      matchScore: app.aiAnalysis?.matchScore || 0,
      experience: app.user.professional?.experience || 0,
      skills: app.aiAnalysis?.skillsMatch?.matched || [],
      missingSkills: app.aiAnalysis?.skillsMatch?.missing || [],
      status: app.status,
      appliedDate: app.submittedAt
    }));

    // Sort by match score
    comparison.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      message: 'Applications compared successfully',
      comparison
    });
  } catch (error) {
    console.error('Compare Applications Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error comparing applications',
      error: error.message
    });
  }
};

/**
 * @desc    Bulk update application status
 * @route   PUT /api/client/applications/bulk-update
 * @access  Private (Client only)
 */
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { applicationIds, status, note } = req.body;

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide application IDs'
      });
    }

    // Verify all applications belong to client
    const applications = await Application.find({
      _id: { $in: applicationIds },
      client: req.userId
    });

    if (applications.length !== applicationIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some applications not found or not authorized'
      });
    }

    // Update all applications
    const updatePromises = applications.map(app => 
      app.updateStatus(status, req.userId, 'Client', note)
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `${applications.length} applications updated successfully`,
      count: applications.length
    });
  } catch (error) {
    console.error('Bulk Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating applications',
      error: error.message
    });
  }
};

export default {
  updateApplicationStatus,
  addApplicationNotes,
  scheduleInterview,
  completeInterview,
  sendOffer,
  rejectApplication,
  getApplicationById,
  compareApplications,
  bulkUpdateStatus
};