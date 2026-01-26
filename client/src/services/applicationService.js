import api from './api';

const applicationService = {
  // Apply for job (user only)
  applyForJob: async (jobId, applicationData) => {
    const response = await api.post(`/user/jobs/${jobId}/apply`, applicationData);
    return response;
  },

  // Apply for gig (user only)
  applyForGig: async (gigId, applicationData) => {
    const response = await api.post(`/user/gigs/${gigId}/apply`, applicationData);
    return response;
  },

  // Get my applications (user only)
  getMyApplications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/user/applications?${queryString}`);
    return response;
  },

  // Withdraw application (user only)
  withdrawApplication: async (applicationId) => {
    const response = await api.put(`/user/applications/${applicationId}/withdraw`);
    return response;
  },

  // Accept offer (user only)
  acceptOffer: async (applicationId) => {
    const response = await api.put(`/user/applications/${applicationId}/accept-offer`);
    return response;
  },

  // Decline offer (user only)
  declineOffer: async (applicationId, reason) => {
    const response = await api.put(`/user/applications/${applicationId}/decline-offer`, { reason });
    return response;
  },

  // Get job applicants (client only)
  getJobApplicants: async (jobId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/client/jobs/${jobId}/applicants?${queryString}`);
    return response;
  },

  // Get gig proposals (client only)
  getGigProposals: async (gigId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/client/gigs/${gigId}/proposals?${queryString}`);
    return response;
  },

  // Update application status (client only)
  updateApplicationStatus: async (applicationId, status, note) => {
    const response = await api.put(`/client/applications/${applicationId}/status`, { status, note });
    return response;
  },

  // Add notes to application (client only)
  addNotes: async (applicationId, notes, rating) => {
    const response = await api.put(`/client/applications/${applicationId}/notes`, { notes, rating });
    return response;
  },

  // Schedule interview (client only)
  scheduleInterview: async (applicationId, interviewData) => {
    const response = await api.put(`/client/applications/${applicationId}/interview`, interviewData);
    return response;
  },

  // Send offer (client only)
  sendOffer: async (applicationId, offerData) => {
    const response = await api.put(`/client/applications/${applicationId}/offer`, offerData);
    return response;
  },

  // Reject application (client only)
  rejectApplication: async (applicationId, reason) => {
    const response = await api.put(`/client/applications/${applicationId}/reject`, { reason });
    return response;
  },

  // Get application by ID
  getApplicationById: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response;
  },
};

export default applicationService;