import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format salary range
 */
export const formatSalary = (min, max, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) {
    return `${formatter.format(min)}+`;
  }
  return 'Not specified';
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
    filled: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    submitted: 'bg-blue-100 text-blue-800',
    'under-review': 'bg-purple-100 text-purple-800',
    shortlisted: 'bg-indigo-100 text-indigo-800',
    interview: 'bg-cyan-100 text-cyan-800',
    offered: 'bg-green-100 text-green-800',
    accepted: 'bg-green-100 text-green-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    approved: 'bg-green-100 text-green-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Get match score color
 */
export const getMatchScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get file size in readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if date is expired
 */
export const isExpired = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Get days remaining
 */
export const getDaysRemaining = (date) => {
  if (!date) return 0;
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Generate random color
 */
export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default {
  formatDate,
  formatDateTime,
  getRelativeTime,
  formatSalary,
  formatNumber,
  truncateText,
  getInitials,
  getStatusColor,
  getMatchScoreColor,
  calculatePercentage,
  debounce,
  formatFileSize,
  isExpired,
  getDaysRemaining,
  generateColor,
  copyToClipboard,
  downloadFile,
};