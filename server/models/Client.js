import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Client Schema - Employer/Company
 * Represents companies or individuals posting jobs and gigs
 */
const clientSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Role Management
  role: {
    type: String,
    enum: ['user', 'client', 'admin'],
    required: [true, 'Role is required'],
    default: 'client'
  },
  
  // Company Information
  company: {
    name: {
      type: String,
      trim: true
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/200'
    },
    website: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    industry: {
      type: String,
      enum: [
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
      ]
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },
    location: {
      address: String,
      city: {
        type: String
      },
      state: String,
      country: {
        type: String
      },
      zipCode: String
    }
  },
  
  // Contact Information
  contactPerson: {
    name: {
      type: String
    },
    designation: String,
    email: {
      type: String
    },
    phone: String
  },
  
  // Social Links
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  
  // Subscription & Billing
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    jobPostingLimit: {
      type: Number,
      default: 5 // Free plan limit
    },
    jobPostingsUsed: {
      type: Number,
      default: 0
    }
  },
  
  // Statistics
  stats: {
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    totalGigsPosted: {
      type: Number,
      default: 0
    },
    activeJobs: {
      type: Number,
      default: 0
    },
    activeGigs: {
      type: Number,
      default: 0
    },
    totalApplicationsReceived: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    }
  },
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String, // URL to uploaded verification document
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Preferences
  preferences: {
    emailNotifications: {
      newApplications: {
        type: Boolean,
        default: true
      },
      jobExpiring: {
        type: Boolean,
        default: true
      },
      weeklyReport: {
        type: Boolean,
        default: false
      }
    }
  },
  
  // Metadata
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
clientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
clientSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to check if can post more jobs
clientSchema.methods.canPostJob = function() {
  return this.subscription.jobPostingsUsed < this.subscription.jobPostingLimit;
};

// Method to get public profile
clientSchema.methods.getPublicProfile = function() {
  const client = this.toObject();
  delete client.password;
  delete client.resetPasswordToken;
  delete client.resetPasswordExpire;
  delete client.emailVerificationToken;
  return client;
};

export default mongoose.model('Client', clientSchema);