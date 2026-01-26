import api from './api';

const authService = {
  // Register user
  register: async (userData) => {
    const endpoint = userData.role === 'client' 
      ? '/auth/register/client' 
      : '/auth/register/user';
    
    const response = await api.post(endpoint, userData);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/update-profile', profileData);
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.put(`/auth/reset-password/${token}`, { newPassword });
    return response;
  },

  // Logout
  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

export default authService;