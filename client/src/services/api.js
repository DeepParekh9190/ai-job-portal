import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        // Don't redirect if we're already trying to login/register or checking current user
        const isAuthRequest = 
          error.config.url.includes('/auth/login') || 
          error.config.url.includes('/auth/register') || 
          error.config.url.includes('/auth/me');

        if (!isAuthRequest) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        // Forbidden - insufficient permissions
        console.error('Access denied:', data.message);
      }

      if (status === 404) {
        // Not found
        console.error('Resource not found:', data.message);
      }

      if (status >= 500) {
        // Server error
        console.error('Server error:', data.message || 'Internal Server Error');
        if (data.error) console.error('Error Details:', data.error);
        if (data.stack) console.error('Server Stack:', data.stack);
      }

      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;