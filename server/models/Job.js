import mongoose from 'mongoose';

/**
 * Job Schema - Full-time/Part-time Job Postings
 * Represents job opportunities posted by clients
 */
const jobSchema = new mongoose.Schema({
  // Posted By
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Job must belong to a client']
  },
  
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  // Job Details
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: [true, 'Please select job type']
  },
  category: {
    type: String,
    enum: [
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
    ],
    required: [true, 'Please select job category']
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      required: [true, 'Please specify location type']
    },
    city: String,
    state: String,
    country: String,
    address: String
  },
  
  // Salary Information
  salary: {
    min: {
      type: Number,
      required: [true, 'Please provide minimum salary']
    },
    max: {
      type: Number,
      required: [true, 'Please provide maximum salary']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  
  // Requirements
  requirements: {
    experience: {
      min: {
        type: Number,
        required: [true, 'Please specify minimum experience required'],
        min: 0
      },
      max: Number
    },
    education: {
      type: String,
      enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any'],
      required: [true, 'Please specify education requirement']
    },
    skills: [{
      type: String,
      trim: true,
      required: [true, 'Please add at least one required skill']
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native']
      }
    }],
    certifications: [String]
  },
  
  // Responsibilities
  responsibilities: [{
    type: String,
    trim: true
  }],
  
  // Benefits
  benefits: [{
    type: String,
    trim: true
  }],
  
  // Application Details
  applicationDeadline: {
    type: Date,
    required: [true, 'Please provide application deadline']
  },
  openings: {
    type: Number,
    required: [true, 'Please specify number of openings'],
    min: 1,
    default: 1
  },
  
  // Status & Approval
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'closed', 'filled', 'rejected'],
    default: 'pending'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: Date,
  rejectionReason: String,
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    hired: {
      type: Number,
      default: 0
    }
  },
  
  // SEO & Search
  tags: [{
    type: String,
    trim: true
  }],
  
  // Featured Job
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date,
  
  // Urgency
  isUrgent: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  expiresAt: {
    type: Date,
    required: [true, 'Job expiration date is required']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobSchema.index({ client: 1, status: 1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ 'location.type': 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for checking if job is expired
jobSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual for checking if application deadline passed
jobSchema.virtual('isDeadlinePassed').get(function() {
  return this.applicationDeadline < new Date();
});

// Virtual for days remaining
jobSchema.virtual('daysRemaining').get(function() {
  const diff = this.applicationDeadline - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Middleware to update lastUpdated
jobSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to increment view count
jobSchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  return await this.save();
};

// Method to increment application count
jobSchema.methods.incrementApplications = async function() {
  this.stats.applications += 1;
  return await this.save();
};

export default mongoose.model('Job', jobSchema);