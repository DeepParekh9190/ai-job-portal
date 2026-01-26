import api from './api';

const jobService = {
  // Get all jobs (public)
  getAllJobs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/user/jobs?${queryString}`);
    return response;
  },

  // Get job by ID (public)
  getJobById: async (id) => {
    const response = await api.get(`/user/jobs/${id}`);
    return response;
  },

  // Create job (client only)
  createJob: async (jobData) => {
    const response = await api.post('/client/jobs', jobData);
    return response;
  },

  // Get my jobs (client only)
  getMyJobs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/client/jobs?${queryString}`);
    return response;
  },

  // Update job (client only)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/client/jobs/${id}`, jobData);
    return response;
  },

  // Delete job (client only)
  deleteJob: async (id) => {
    const response = await api.delete(`/client/jobs/${id}`);
    return response;
  },

  // Close job (client only)
  closeJob: async (id) => {
    const response = await api.put(`/client/jobs/${id}/close`);
    return response;
  },

  // Mark job as filled (client only)
  markJobFilled: async (id) => {
    const response = await api.put(`/client/jobs/${id}/filled`);
    return response;
  },

  // Get job statistics (client only)
  getJobStats: async (id) => {
    const response = await api.get(`/client/jobs/${id}/stats`);
    return response;
  },
};

export default jobService;