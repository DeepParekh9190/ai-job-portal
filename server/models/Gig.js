import mongoose from 'mongoose';

/**
 * Gig Schema - Freelance/Project-based Work
 * Represents short-term projects and freelance opportunities
 */
const gigSchema = new mongoose.Schema({
  // Posted By
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Gig must belong to a client']
  },
  
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide gig title'],
    trim: true,
    maxlength: [100, 'Gig title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide gig description'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  
  // Gig Details
  category: {
    type: String,
    enum: [
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
    ],
    required: [true, 'Please select gig category']
  },
  
  // Project Scope
  scope: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: [true, 'Please specify project scope']
  },
  
  // Duration
  duration: {
    value: {
      type: Number,
      required: [true, 'Please specify duration']
    },
    unit: {
      type: String,
      enum: ['hours', 'days', 'weeks', 'months'],
      required: [true, 'Please specify duration unit']
    },
    isFlexible: {
      type: Boolean,
      default: false
    }
  },
  
  // Budget
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: [true, 'Please specify budget type']
    },
    amount: {
      type: Number,
      required: [true, 'Please specify budget amount']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  
  // Skills Required
  skills: [{
    type: String,
    trim: true,
    required: [true, 'Please add at least one required skill']
  }],
  
  // Experience Level
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'expert'],
    required: [true, 'Please specify required experience level']
  },
  
  // Deliverables
  deliverables: [{
    type: String,
    trim: true
  }],
  
  // Attachments (Project files, references)
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Location Preference
  location: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote'
  },
  specificLocation: {
    city: String,
    state: String,
    country: String
  },
  
  // Application Details
  applicationDeadline: {
    type: Date,
    required: [true, 'Please provide application deadline']
  },
  
  // Project Start Date
  startDate: {
    type: Date,
    required: [true, 'Please provide project start date']
  },
  
  // Status & Approval
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'in-progress', 'completed', 'closed', 'cancelled'],
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
  
  // Assigned Freelancer
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  
  // Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    proposals: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    }
  },
  
  // Payment Terms
  paymentTerms: {
    milestones: [{
      title: String,
      percentage: Number,
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'completed', 'paid'],
        default: 'pending'
      }
    }],
    paymentMethod: {
      type: String,
      enum: ['bank-transfer', 'paypal', 'stripe', 'other']
    }
  },
  
  // Featured Gig
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
  
  // Tags for search
  tags: [{
    type: String,
    trim: true
  }],
  
  // Metadata
  expiresAt: {
    type: Date,
    required: [true, 'Gig expiration date is required']
  },
  completedAt: Date,
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
gigSchema.index({ client: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ experienceLevel: 1 });
gigSchema.index({ createdAt: -1 });
gigSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for checking if gig is expired
gigSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual for checking if application deadline passed
gigSchema.virtual('isDeadlinePassed').get(function() {
  return this.applicationDeadline < new Date();
});

// Virtual for days remaining
gigSchema.virtual('daysRemaining').get(function() {
  const diff = this.applicationDeadline - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for total budget calculation
gigSchema.virtual('totalBudget').get(function() {
  if (this.budget.type === 'fixed') {
    return this.budget.amount;
  }
  // For hourly, estimate based on duration
  const hours = this.duration.unit === 'hours' ? this.duration.value :
                this.duration.unit === 'days' ? this.duration.value * 8 :
                this.duration.unit === 'weeks' ? this.duration.value * 40 :
                this.duration.value * 160; // months
  return this.budget.amount * hours;
});

// Middleware to update lastUpdated
gigSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to increment view count
gigSchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  return await this.save();
};

// Method to increment proposal count
gigSchema.methods.incrementProposals = async function() {
  this.stats.proposals += 1;
  return await this.save();
};

export default mongoose.model('Gig', gigSchema);