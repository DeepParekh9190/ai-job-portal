import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema - Job Seeker/Freelancer
 * Represents individuals looking for jobs or gig work
 */
const userSchema = new mongoose.Schema({
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
    select: false // Don't return password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  
  // Role Management
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  
  // Profile Information
  profile: {
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    location: {
      city: String,
      state: String,
      country: String
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    }
  },
  
  // Professional Information
  professional: {
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    experience: {
      type: Number, // Years of experience
      min: 0,
      max: 50
    },
    skills: [{
      type: String,
      trim: true
    }],
    education: [{
      degree: String,
      institution: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      grade: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String
    }],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native']
      }
    }]
  },
  
  // Resume Information
  resume: {
    uploadedResume: {
      filename: String,
      url: String,
      uploadedAt: Date
    },
    aiGeneratedResume: {
      content: String,
      generatedAt: Date
    },
    lastAnalysis: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      analyzedAt: Date
    }
  },
  
  // Job Preferences
  preferences: {
    jobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship']
    }],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    willingToRelocate: {
      type: Boolean,
      default: false
    },
    remoteWork: {
      type: Boolean,
      default: true
    },
    preferredLocations: [String],
    industries: [String]
  },
  
  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String
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
  
  // Metadata
  lastLogin: Date,
  totalApplications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  delete user.emailVerificationToken;
  return user;
};

export default mongoose.model('User', userSchema);