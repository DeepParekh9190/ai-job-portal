// Job Categories
export const JOB_CATEGORIES = [
  'Software Development',
  'Design',
  'Marketing',
  'Sales',
  'Customer Support',
  'Human Resources',
  'Finance',
  'Operations',
  'Engineering',
  'Data Science',
  'Product Management',
  'Content Writing',
  'Legal',
  'Healthcare',
  'Education',
  'Other'
];

// Gig Categories
export const GIG_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Video Editing',
  'Digital Marketing',
  'SEO',
  'Data Entry',
  'Virtual Assistant',
  'Consulting',
  'Translation',
  'Voice Over',
  'Animation',
  'Photography',
  'Other'
];

// Job Types
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

// Location Types
export const LOCATION_TYPES = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' }
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 0, label: 'Entry Level (0-1 years)' },
  { value: 2, label: 'Mid Level (2-5 years)' },
  { value: 5, label: 'Senior (5-10 years)' },
  { value: 10, label: 'Expert (10+ years)' }
];

// Gig Experience Levels
export const GIG_EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' }
];

// Gig Scopes
export const GIG_SCOPES = [
  { value: 'small', label: 'Small (< 1 week)' },
  { value: 'medium', label: 'Medium (1-4 weeks)' },
  { value: 'large', label: 'Large (1+ months)' }
];

// Education Levels
export const EDUCATION_LEVELS = [
  'High School',
  'Associate',
  'Bachelor',
  'Master',
  'PhD',
  'Any'
];

// Application Statuses
export const APPLICATION_STATUSES = [
  { value: 'submitted', label: 'Submitted', color: 'blue' },
  { value: 'under-review', label: 'Under Review', color: 'purple' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'indigo' },
  { value: 'interview', label: 'Interview', color: 'cyan' },
  { value: 'offered', label: 'Offered', color: 'green' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'gray' }
];

// Job Statuses
export const JOB_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'filled', label: 'Filled' },
  { value: 'rejected', label: 'Rejected' }
];

// Salary Periods
export const SALARY_PERIODS = [
  { value: 'hourly', label: 'Per Hour' },
  { value: 'monthly', label: 'Per Month' },
  { value: 'yearly', label: 'Per Year' }
];

// Budget Types
export const BUDGET_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' }
];

// Duration Units
export const DURATION_UNITS = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
];

// Skills List (Common)
export const COMMON_SKILLS = [
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'Angular',
  'Vue.js',
  'TypeScript',
  'PHP',
  'Ruby',
  'C++',
  'C#',
  'Swift',
  'Kotlin',
  'Go',
  'Rust',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'Agile',
  'Scrum',
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Photoshop',
  'Illustrator',
  'Marketing',
  'SEO',
  'Content Writing',
  'Project Management',
  'Data Analysis',
  'Machine Learning',
  'AI',
  'Communication',
  'Leadership',
  'Problem Solving',
  'Teamwork'
];

// Company Sizes
export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

// Industries
export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Construction',
  'Hospitality',
  'Transportation',
  'Real Estate',
  'Marketing',
  'Consulting',
  'Other'
];

// Pagination
export const ITEMS_PER_PAGE = 10;
export const MAX_PAGE_BUTTONS = 5;

// File Upload
export const ALLOWED_FILE_TYPES = {
  resume: ['.pdf', '.doc', '.docx'],
  image: ['.jpg', '.jpeg', '.png', '.gif']
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // User Routes
  USER_DASHBOARD: '/user/dashboard',
  BROWSE_JOBS: '/jobs',
  BROWSE_GIGS: '/gigs',
  JOB_DETAILS: '/jobs/:id',
  APPLY_JOB: '/user/jobs/:id/apply',
  MY_APPLICATIONS: '/user/applications',
  RESUME_BUILDER: '/user/resume-builder',
  RESUME_ANALYZER: '/user/resume-analyzer',
  
  // Client Routes
  CLIENT_DASHBOARD: '/client/dashboard',
  POST_JOB: '/client/post-job',
  POST_GIG: '/client/post-gig',
  MY_JOBS: '/client/jobs',
  MY_GIGS: '/client/gigs',
  APPLICANTS: '/client/jobs/:id/applicants',
  
  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  MANAGE_USERS: '/admin/users',
  MANAGE_CLIENTS: '/admin/clients',
  APPROVE_JOBS: '/admin/jobs',
  ANALYTICS: '/admin/analytics'
};

export default {
  JOB_CATEGORIES,
  GIG_CATEGORIES,
  JOB_TYPES,
  LOCATION_TYPES,
  EXPERIENCE_LEVELS,
  GIG_EXPERIENCE_LEVELS,
  GIG_SCOPES,
  EDUCATION_LEVELS,
  APPLICATION_STATUSES,
  JOB_STATUSES,
  SALARY_PERIODS,
  BUDGET_TYPES,
  DURATION_UNITS,
  COMMON_SKILLS,
  COMPANY_SIZES,
  INDUSTRIES,
  ITEMS_PER_PAGE,
  MAX_PAGE_BUTTONS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  API_BASE_URL,
  ROUTES
};