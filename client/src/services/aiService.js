import api from './api';

const aiService = {
  // Generate AI resume
  generateResume: async (resumeData) => {
    const response = await api.post('/ai/generate-resume', resumeData);
    return response;
  },

  // Analyze resume
  analyzeResume: async (resumeData) => {
    const response = await api.post('/ai/analyze-resume', resumeData);
    return response;
  },

  // Calculate job match score
  calculateJobMatch: async (jobId) => {
    const response = await api.post('/ai/match-job', { jobId });
    return response;
  },

  // Get recommended jobs
  getRecommendedJobs: async (limit = 10) => {
    const response = await api.get(`/ai/recommended-jobs?limit=${limit}`);
    return response;
  },

  // Generate professional summary
  generateSummary: async (data) => {
    const response = await api.post('/ai/generate-summary', data);
    return response;
  },

  // Generate job description
  generateJobDescription: async (data) => {
    const response = await api.post('/ai/generate-job-description', data);
    return response;
  },

  // Improve resume section
  improveSection: async (sectionName, content) => {
    const response = await api.post('/ai/improve-section', { sectionName, content });
    return response;
  },

  // Generate cover letter
  generateCoverLetter: async (jobId) => {
    const response = await api.post('/ai/generate-cover-letter', { jobId });
    return response;
  },

  // Get keyword suggestions
  getKeywordSuggestions: async (industry, jobTitle) => {
    const response = await api.post('/ai/suggest-keywords', { industry, jobTitle });
    return response;
  },

  // Get skill recommendations
  getSkillRecommendations: async () => {
    const response = await api.get('/ai/recommend-skills');
    return response;
  },
};

export default aiService;