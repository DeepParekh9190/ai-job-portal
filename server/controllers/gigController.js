import Gig from '../models/Gig.js';
import Client from '../models/Client.js';
import Application from '../models/Application.js';

/**
 * @desc    Create new gig posting
 * @route   POST /api/client/gigs
 * @access  Private (Client only)
 */
export const createGig = async (req, res) => {
  try {
    const clientId = req.userId;

    // Create gig
    const gig = await Gig.create({
      ...req.body,
      client: clientId,
      status: 'pending',
      approvalStatus: 'pending'
    });

    // Update client stats
    const client = await Client.findById(clientId);
    client.stats.totalGigsPosted += 1;
    client.stats.activeGigs += 1;
    await client.save();

    res.status(201).json({
      success: true,
      message: 'Gig created successfully. Awaiting admin approval.',
      gig
    });
  } catch (error) {
    console.error('Create Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gig',
      error: error.message
    });
  }
};

/**
 * @desc    Get all gigs (with filters)
 * @route   GET /api/gigs
 * @access  Public
 */
export const getAllGigs = async (req, res) => {
  try {
    const {
      category,
      experienceLevel,
      budgetMin,
      budgetMax,
      scope,
      location,
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
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (budgetMin) query['budget.amount'] = { $gte: parseInt(budgetMin) };
    if (budgetMax) query['budget.amount'] = { ...query['budget.amount'], $lte: parseInt(budgetMax) };
    if (scope) query.scope = scope;
    if (location) query.location = location;
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const gigs = await Gig.find(query)
      .populate('client', 'name company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments(query);

    res.status(200).json({
      success: true,
      count: gigs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      gigs
    });
  } catch (error) {
    console.error('Get All Gigs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs',
      error: error.message
    });
  }
};

/**
 * @desc    Get single gig details
 * @route   GET /api/gigs/:id
 * @access  Public
 */
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('client', 'name company email phone')
      .populate('assignedTo', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Increment view count
    await gig.incrementViews();

    res.status(200).json({
      success: true,
      gig
    });
  } catch (error) {
    console.error('Get Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gig',
      error: error.message
    });
  }
};

/**
 * @desc    Get client's posted gigs
 * @route   GET /api/client/gigs
 * @access  Private (Client only)
 */
export const getMyGigs = async (req, res) => {
  try {
    const clientId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: clientId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const gigs = await Gig.find(query)
      .populate('assignedTo', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments(query);

    res.status(200).json({
      success: true,
      count: gigs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      gigs
    });
  } catch (error) {
    console.error('Get My Gigs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your gigs',
      error: error.message
    });
  }
};

/**
 * @desc    Update gig
 * @route   PUT /api/client/gigs/:id
 * @access  Private (Client only)
 */
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check ownership
    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    // Don't allow updates to approved gigs without re-approval
    if (gig.approvalStatus === 'approved') {
      req.body.approvalStatus = 'pending';
      req.body.status = 'pending';
    }

    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      gig: updatedGig
    });
  } catch (error) {
    console.error('Update Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gig',
      error: error.message
    });
  }
};

/**
 * @desc    Delete gig
 * @route   DELETE /api/client/gigs/:id
 * @access  Private (Client only)
 */
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // Check ownership
    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    // Soft delete
    gig.status = 'cancelled';
    await gig.save();

    // Update client stats
    const client = await Client.findById(req.userId);
    client.stats.activeGigs = Math.max(0, client.stats.activeGigs - 1);
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    console.error('Delete Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gig',
      error: error.message
    });
  }
};

/**
 * @desc    Get proposals for a gig
 * @route   GET /api/client/gigs/:id/proposals
 * @access  Private (Client only)
 */
export const getGigProposals = async (req, res) => {
  try {
    const gigId = req.params.id;
    const { status, sortBy = '-aiAnalysis.matchScore', page = 1, limit = 20 } = req.query;

    // Verify gig ownership
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these proposals'
      });
    }

    // Build query
    const query = { gig: gigId, applicationType: 'gig' };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get proposals
    const applications = await Application.find(query)
      .populate('user', 'name email phone profile professional')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get statistics
    const stats = await Application.aggregate([
      { $match: { gig: gig._id } },
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
      proposals: applications
    });
  } catch (error) {
    console.error('Get Gig Proposals Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching proposals',
      error: error.message
    });
  }
};

/**
 * @desc    Assign gig to freelancer
 * @route   PUT /api/client/gigs/:id/assign
 * @access  Private (Client only)
 */
export const assignGig = async (req, res) => {
  try {
    const { userId } = req.body;
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    gig.assignedTo = userId;
    gig.assignedAt = new Date();
    gig.status = 'in-progress';
    await gig.save();

    // Update application status
    await Application.findOneAndUpdate(
      { gig: gigId, user: userId },
      { status: 'accepted' }
    );

    res.status(200).json({
      success: true,
      message: 'Gig assigned successfully',
      gig
    });
  } catch (error) {
    console.error('Assign Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning gig',
      error: error.message
    });
  }
};

/**
 * @desc    Mark gig as completed
 * @route   PUT /api/client/gigs/:id/complete
 * @access  Private (Client only)
 */
export const markGigCompleted = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    gig.status = 'completed';
    gig.completedAt = new Date();
    await gig.save();

    // Update client stats
    const client = await Client.findById(req.userId);
    client.stats.activeGigs = Math.max(0, client.stats.activeGigs - 1);
    await client.save();

    res.status(200).json({
      success: true,
      message: 'Gig marked as completed',
      gig
    });
  } catch (error) {
    console.error('Complete Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing gig',
      error: error.message
    });
  }
};

/**
 * @desc    Update milestone status
 * @route   PUT /api/client/gigs/:id/milestones/:milestoneIndex
 * @access  Private (Client only)
 */
export const updateMilestone = async (req, res) => {
  try {
    const { id, milestoneIndex } = req.params;
    const { status } = req.body;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!gig.paymentTerms?.milestones?.[milestoneIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    gig.paymentTerms.milestones[milestoneIndex].status = status;
    await gig.save();

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      milestone: gig.paymentTerms.milestones[milestoneIndex]
    });
  } catch (error) {
    console.error('Update Milestone Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating milestone',
      error: error.message
    });
  }
};

/**
 * @desc    Get gig statistics
 * @route   GET /api/client/gigs/:id/stats
 * @access  Private (Client only)
 */
export const getGigStats = async (req, res) => {
  try {
    const gigId = req.params.id;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.client.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Get proposal statistics
    const proposalStats = await Application.aggregate([
      { $match: { gig: gig._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgBidAmount: { $avg: '$bidAmount.amount' }
        }
      }
    ]);

    // Get top proposals by match score
    const topProposals = await Application.find({ gig: gigId })
      .sort('-aiAnalysis.matchScore')
      .limit(5)
      .populate('user', 'name email professional.title professional.experience');

    res.status(200).json({
      success: true,
      stats: {
        views: gig.stats.views,
        proposals: gig.stats.proposals,
        shortlisted: gig.stats.shortlisted,
        proposalBreakdown: proposalStats,
        topProposals
      }
    });
  } catch (error) {
    console.error('Get Gig Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gig statistics',
      error: error.message
    });
  }
};

export default {
  createGig,
  getAllGigs,
  getGigById,
  getMyGigs,
  updateGig,
  deleteGig,
  getGigProposals,
  assignGig,
  markGigCompleted,
  updateMilestone,
  getGigStats
};