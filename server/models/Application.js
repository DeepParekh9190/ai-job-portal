import mongoose from 'mongoose';

/**
 * Application Schema - Job/Gig Applications
 * Tracks applications submitted by users to jobs or gigs
 */
const applicationSchema = new mongoose.Schema({
  // Applicant
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Application must have a user']
  },
  
  // Applied To (Either Job or Gig)
  applicationType: {
    type: String,
    enum: ['job', 'gig'],
    required: [true, 'Please specify application type']
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig'
  },
  
  // Client who posted the job/gig
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Application must have associated client']
  },
  
  // Application Details
  coverLetter: {
    type: String,
    required: [true, 'Please provide a cover letter'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  
  // Resume Information
  resume: {
    type: {
      type: String,
      enum: ['uploaded', 'generated'],
      required: true
    },
    url: String,
    filename: String,
    content: String // For AI-generated resumes
  },
  
  // Additional Documents
  portfolio: {
    url: String,
    description: String
  },
  additionalDocuments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Expected Salary (for jobs)
  expectedSalary: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly']
    }
  },
  
  // Bid Amount (for gigs)
  bidAmount: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    proposedDuration: {
      value: Number,
      unit: String
    }
  },
  
  // Availability
  availability: {
    startDate: {
      type: Date,
      required: [true, 'Please specify when you can start']
    },
    noticePeriod: {
      value: Number,
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months']
      }
    }
  },
  
  // Application Status
  status: {
    type: String,
    enum: [
      'submitted',      // Initial submission
      'under-review',   // Being reviewed by client
      'shortlisted',    // Selected for next round
      'interview',      // Interview scheduled
      'offered',        // Job/Gig offered
      'accepted',       // Applicant accepted offer
      'rejected',       // Application rejected
      'withdrawn'       // Applicant withdrew
    ],
    default: 'submitted'
  },
  
  // Status History (Track all status changes)
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'statusHistory.changedByModel'
    },
    changedByModel: {
      type: String,
      enum: ['User', 'Client', 'Admin']
    },
    note: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // AI Analysis Results
  aiAnalysis: {
    matchScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skillsMatch: {
      matched: [String],
      missing: [String],
      additional: [String],
      score: Number
    },
    experienceMatch: {
      required: Number,
      applicant: Number,
      score: Number
    },
    educationMatch: {
      required: String,
      applicant: String,
      score: Number
    },
    overallAnalysis: String,
    strengths: [String],
    concerns: [String],
    recommendations: [String],
    analyzedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Interview Details
  interview: {
    scheduled: {
      type: Boolean,
      default: false
    },
    date: Date,
    time: String,
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person']
    },
    meetingLink: String,
    location: String,
    notes: String,
    completed: {
      type: Boolean,
      default: false
    },
    feedback: String
  },
  
  // Client's Notes & Rating
  clientNotes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  clientRating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Rejection Details
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot exceed 500 characters']
  },
  rejectedAt: Date,
  
  // Offer Details
  offerDetails: {
    salary: {
      amount: Number,
      currency: String,
      period: String
    },
    startDate: Date,
    benefits: [String],
    offerLetter: String, // URL to offer letter
    expiresAt: Date,
    acceptedAt: Date,
    declinedAt: Date,
    declineReason: String
  },
  
  // Metadata
  viewedByClient: {
    type: Boolean,
    default: false
  },
  viewedAt: Date,
  
  // Timestamps for tracking
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ client: 1, status: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ gig: 1 });
applicationSchema.index({ 'aiAnalysis.matchScore': -1 });
applicationSchema.index({ createdAt: -1 });

// Validation: Either job or gig must be present
applicationSchema.pre('save', function(next) {
  if (!this.job && !this.gig) {
    return next(new Error('Application must be for either a job or a gig'));
  }
  if (this.job && this.gig) {
    return next(new Error('Application cannot be for both job and gig'));
  }
  this.lastUpdated = Date.now();
  next();
});

// Method to update status with history
applicationSchema.methods.updateStatus = async function(newStatus, changedBy, changedByModel, note) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy,
    changedByModel,
    note,
    changedAt: new Date()
  });
  return await this.save();
};

// Method to mark as viewed by client
applicationSchema.methods.markAsViewed = async function() {
  if (!this.viewedByClient) {
    this.viewedByClient = true;
    this.viewedAt = new Date();
    return await this.save();
  }
  return this;
};

// Virtual for days since application
applicationSchema.virtual('daysSinceApplied').get(function() {
  const diff = new Date() - this.submittedAt;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
});

export default mongoose.model('Application', applicationSchema);