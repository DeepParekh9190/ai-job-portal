import api from './api';

const adminService = {
  // Get all jobs for approval
  getAllJobsForApproval: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/jobs?${queryString}`);
    return response;
  },

  // Approve or reject a job
  approveJob: async (id, data) => {
    const response = await api.put(`/admin/jobs/${id}/approve`, data);
    return response;
  },

  // Get all gigs for approval
  getAllGigsForApproval: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/gigs?${queryString}`);
    return response;
  },

  // Approve or reject a gig
  approveGig: async (id, data) => {
    const response = await api.put(`/admin/gigs/${id}/approve`, data);
    return response;
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users?${queryString}`);
    return response;
  },

  // Update user status
  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response;
  },

  // Get all clients
  getAllClients: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/clients?${queryString}`);
    return response;
  },

  // Update client status
  updateClientStatus: async (id, isActive) => {
    const response = await api.put(`/admin/clients/${id}/status`, { isActive });
    return response;
  },

  // Get platform analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response;
  }
};

export default adminService;
