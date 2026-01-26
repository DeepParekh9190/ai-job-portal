import User from '../models/User.js';
import Client from '../models/Client.js';
import Job from '../models/Job.js';
import Gig from '../models/Gig.js';
import Application from '../models/Application.js';
import Resume from '../models/Resume.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { 
      search, 
      isActive, 
      isEmailVerified,
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isEmailVerified !== undefined) query.isEmailVerified = isEmailVerified === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      users
    });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * @desc    Get all clients
 * @route   GET /api/admin/clients
 * @access  Private (Admin only)
 */
export const getAllClients = async (req, res) => {
  try {
    const {
      search,
      isActive,
      isVerified,
      verificationStatus,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { 'company.name': new RegExp(search, 'i') }
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    if (verificationStatus) query.verificationStatus = verificationStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const clients = await Client.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      count: clients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      clients
    });
  } catch (error) {
    console.error('Get All Clients Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const applicationCount = await Application.countDocuments({ user: user._id });
    const resumeCount = await Resume.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      user,
      stats: {
        totalApplications: applicationCount,
        totalResumes: resumeCount
      }
    });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * @desc    Get client by ID
 * @route   GET /api/admin/clients/:id
 * @access  Private (Admin only)
 */
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('-password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Get client statistics
    const jobCount = await Job.countDocuments({ client: client._id });
    const gigCount = await Gig.countDocuments({ client: client._id });
    const applicationCount = await Application.countDocuments({ client: client._id });

    res.status(200).json({
      success: true,
      client,
      stats: {
        totalJobs: jobCount,
        totalGigs: gigCount,
        totalApplicationsReceived: applicationCount
      }
    });
  } catch (error) {
    console.error('Get Client Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
};

/**
 * @desc    Update user status (activate/deactivate)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin only)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Update User Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

/**
 * @desc    Update client status (activate/deactivate)
 * @route   PUT /api/admin/clients/:id/status
 * @access  Private (Admin only)
 */
export const updateClientStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Client ${isActive ? 'activated' : 'deactivated'} successfully`,
      client
    });
  } catch (error) {
    console.error('Update Client Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client status',
      error: error.message
    });
  }
};

/**
 * @desc    Verify client company
 * @route   PUT /api/admin/clients/:id/verify
 * @access  Private (Admin only)
 */
export const verifyClient = async (req, res) => {
  try {
    const { verificationStatus, rejectionReason } = req.body;

    const updateData = {
      verificationStatus,
      isVerified: verificationStatus === 'approved'
    };

    if (verificationStatus === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // TODO: Send verification email notification

    res.status(200).json({
      success: true,
      message: `Client verification ${verificationStatus}`,
      client
    });
  } catch (error) {
    console.error('Verify Client Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying client',
      error: error.message
    });
  }
};

/**
 * @desc    Get all jobs for approval
 * @route   GET /api/admin/jobs
 * @access  Private (Admin only)
 */
export const getAllJobsForApproval = async (req, res) => {
  try {
    const {
      approvalStatus,
      status,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate('client', 'name company email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    // Get pending count
    const pendingCount = await Job.countDocuments({ approvalStatus: 'pending' });

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pendingCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      jobs
    });
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};

/**
 * @desc    Get all gigs for approval
 * @route   GET /api/admin/gigs
 * @access  Private (Admin only)
 */
export const getAllGigsForApproval = async (req, res) => {
  try {
    const {
      approvalStatus,
      status,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = {};
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const gigs = await Gig.find(query)
      .populate('client', 'name company email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gig.countDocuments(query);

    // Get pending count
    const pendingCount = await Gig.countDocuments({ approvalStatus: 'pending' });

    res.status(200).json({
      success: true,
      count: gigs.length,
      total,
      pendingCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      gigs
    });
  } catch (error) {
    console.error('Get Gigs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gigs',
      error: error.message
    });
  }
};

/**
 * @desc    Approve/Reject job
 * @route   PUT /api/admin/jobs/:id/approve
 * @access  Private (Admin only)
 */
export const approveJob = async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    const updateData = {
      approvalStatus,
      status: approvalStatus === 'approved' ? 'active' : 'rejected',
      approvedBy: approvalStatus === 'approved' ? req.userId : undefined,
      approvedAt: approvalStatus === 'approved' ? new Date() : undefined,
      rejectionReason: approvalStatus === 'rejected' ? rejectionReason : undefined
    };

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // TODO: Send notification to client

    res.status(200).json({
      success: true,
      message: `Job ${approvalStatus}`,
      job
    });
  } catch (error) {
    console.error('Approve Job Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving job',
      error: error.message
    });
  }
};

/**
 * @desc    Approve/Reject gig
 * @route   PUT /api/admin/gigs/:id/approve
 * @access  Private (Admin only)
 */
export const approveGig = async (req, res) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    const updateData = {
      approvalStatus,
      status: approvalStatus === 'approved' ? 'active' : 'cancelled',
      approvedBy: approvalStatus === 'approved' ? req.userId : undefined,
      approvedAt: approvalStatus === 'approved' ? new Date() : undefined,
      rejectionReason: approvalStatus === 'rejected' ? rejectionReason : undefined
    };

    const gig = await Gig.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    // TODO: Send notification to client

    res.status(200).json({
      success: true,
      message: `Gig ${approvalStatus}`,
      gig
    });
  } catch (error) {
    console.error('Approve Gig Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving gig',
      error: error.message
    });
  }
};

/**
 * @desc    Get platform analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin only)
 */
export const getAnalytics = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Client statistics
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ isActive: true });
    const verifiedClients = await Client.countDocuments({ isVerified: true });
    const pendingVerification = await Client.countDocuments({ verificationStatus: 'pending' });

    // Job statistics
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active', approvalStatus: 'approved' });
    const pendingJobs = await Job.countDocuments({ approvalStatus: 'pending' });
    const filledJobs = await Job.countDocuments({ status: 'filled' });

    // Gig statistics
    const totalGigs = await Gig.countDocuments();
    const activeGigs = await Gig.countDocuments({ status: 'active', approvalStatus: 'approved' });
    const pendingGigs = await Gig.countDocuments({ approvalStatus: 'pending' });
    const completedGigs = await Gig.countDocuments({ status: 'completed' });

    // Application statistics
    const totalApplications = await Application.countDocuments();
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newClientsLast30Days = await Client.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newJobsLast30Days = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newApplicationsLast30Days = await Application.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Top categories
    const topJobCategories = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topGigCategories = await Gig.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          newLast30Days: newUsersLast30Days
        },
        clients: {
          total: totalClients,
          active: activeClients,
          verified: verifiedClients,
          pendingVerification,
          newLast30Days: newClientsLast30Days
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          pending: pendingJobs,
          filled: filledJobs,
          newLast30Days: newJobsLast30Days
        },
        gigs: {
          total: totalGigs,
          active: activeGigs,
          pending: pendingGigs,
          completed: completedGigs
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          newLast30Days: newApplicationsLast30Days
        },
        topCategories: {
          jobs: topJobCategories,
          gigs: topGigCategories
        }
      }
    });
  } catch (error) {
    console.error('Get Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's applications and resumes
    await Application.deleteMany({ user: user._id });
    await Resume.deleteMany({ user: user._id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * @desc    Delete client
 * @route   DELETE /api/admin/clients/:id
 * @access  Private (Admin only)
 */
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Delete client's jobs, gigs, and related applications
    await Job.deleteMany({ client: client._id });
    await Gig.deleteMany({ client: client._id });
    await Application.deleteMany({ client: client._id });

    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete Client Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
};

export default {
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
};