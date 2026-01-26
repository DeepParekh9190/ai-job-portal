import api from './api';

const gigService = {
  // Get all gigs (public)
  getAllGigs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/user/gigs?${queryString}`);
    return response;
  },

  // Get gig by ID (public)
  getGigById: async (id) => {
    const response = await api.get(`/user/gigs/${id}`);
    return response;
  },

  // Create gig (client only)
  createGig: async (gigData) => {
    const response = await api.post('/client/gigs', gigData);
    return response;
  },

  // Get my gigs (client only)
  getMyGigs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/client/gigs?${queryString}`);
    return response;
  },

  // Update gig (client only)
  updateGig: async (id, gigData) => {
    const response = await api.put(`/client/gigs/${id}`, gigData);
    return response;
  },

  // Delete gig (client only)
  deleteGig: async (id) => {
    const response = await api.delete(`/client/gigs/${id}`);
    return response;
  },

  // Assign gig to freelancer (client only)
  assignGig: async (id, userId) => {
    const response = await api.put(`/client/gigs/${id}/assign`, { userId });
    return response;
  },

  // Mark gig as completed (client only)
  markGigCompleted: async (id) => {
    const response = await api.put(`/client/gigs/${id}/complete`);
    return response;
  },

  // Update milestone (client only)
  updateMilestone: async (id, milestoneIndex, status) => {
    const response = await api.put(`/client/gigs/${id}/milestones/${milestoneIndex}`, { status });
    return response;
  },

  // Get gig statistics (client only)
  getGigStats: async (id) => {
    const response = await api.get(`/client/gigs/${id}/stats`);
    return response;
  },
};

export default gigService;