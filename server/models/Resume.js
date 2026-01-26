import mongoose from 'mongoose';

/**
 * Resume Schema - AI-Generated and Uploaded Resumes
 * Stores resume data with AI analysis results
 */
const resumeSchema = new mongoose.Schema({
  // Owner
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Resume must belong to a user']
  },
  
  // Resume Type
  type: {
    type: String,
    enum: ['uploaded', 'ai-generated'],
    required: [true, 'Please specify resume type']
  },
  
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide resume title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    phone: String,
    location: {
      city: String,
      state: String,
      country: String
    },
    website: String,
    linkedin: String,
    github: String,
    portfolio: String
  },
  
  // Professional Summary
  summary: {
    type: String,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  
  // Work Experience
  experience: [{
    jobTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    currentlyWorking: {
      type: Boolean,
      default: false
    },
    description: String,
    achievements: [String],
    skills: [String]
  }],
  
  // Education
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String,
    achievements: [String]
  }],
  
  // Skills
  skills: {
    technical: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      }
    }],
    soft: [String],
    languages: [{
      language: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native']
      }
    }]
  },
  
  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    verificationUrl: String
  }],
  
  // Projects
  projects: [{
    name: String,
    description: String,
    role: String,
    startDate: Date,
    endDate: Date,
    technologies: [String],
    url: String,
    achievements: [String]
  }],
  
  // Awards & Achievements
  awards: [{
    title: String,
    issuer: String,
    date: Date,
    description: String
  }],
  
  // Publications
  publications: [{
    title: String,
    publisher: String,
    date: Date,
    url: String,
    description: String
  }],
  
  // Volunteer Work
  volunteer: [{
    organization: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  // File Information (for uploaded resumes)
  file: {
    filename: String,
    url: String,
    size: Number,
    mimeType: String,
    uploadedAt: Date
  },
  
  // AI Generation Data (for AI-generated resumes)
  aiGeneration: {
    prompt: String,
    model: String,
    generatedAt: Date,
    tokensUsed: Number
  },
  
  // AI Analysis Results
  analysis: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    sections: {
      formatting: {
        score: Number,
        feedback: String
      },
      content: {
        score: Number,
        feedback: String
      },
      keywords: {
        score: Number,
        feedback: String
      },
      grammar: {
        score: Number,
        feedback: String
      },
      atsCompatibility: {
        score: Number,
        feedback: String
      }
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    keywordAnalysis: {
      present: [String],
      missing: [String],
      frequency: [{
        keyword: String,
        count: Number
      }]
    },
    industryMatch: {
      industry: String,
      matchScore: Number
    },
    analyzedAt: {
      type: Date,
      default: Date.now
    },
    analyzedBy: {
      type: String,
      enum: ['claude', 'gpt-4', 'gpt-3.5']
    }
  },
  
  // Resume Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  
  // Usage Statistics
  stats: {
    downloads: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    applicationsUsed: {
      type: Number,
      default: 0
    }
  },
  
  // Template & Styling (for AI-generated resumes)
  template: {
    name: String,
    theme: String,
    colors: {
      primary: String,
      secondary: String,
      text: String
    },
    font: String
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    versionNumber: Number,
    content: mongoose.Schema.Types.Mixed,
    createdAt: Date
  }],
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  lastAnalyzed: Date,
  lastUsed: Date
}, {
  timestamps: true
});

// Indexes for better query performance
resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ user: 1, isPrimary: 1 });
resumeSchema.index({ 'analysis.overallScore': -1 });
resumeSchema.index({ createdAt: -1 });

// Ensure only one primary resume per user
resumeSchema.pre('save', async function(next) {
  if (this.isPrimary && this.isModified('isPrimary')) {
    await mongoose.model('Resume').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isPrimary: false }
    );
  }
  this.lastUpdated = Date.now();
  next();
});

// Method to increment download count
resumeSchema.methods.incrementDownloads = async function() {
  this.stats.downloads += 1;
  this.lastUsed = new Date();
  return await this.save();
};

// Method to increment view count
resumeSchema.methods.incrementViews = async function() {
  this.stats.views += 1;
  return await this.save();
};

// Method to create new version
resumeSchema.methods.createVersion = async function() {
  this.previousVersions.push({
    versionNumber: this.version,
    content: this.toObject(),
    createdAt: new Date()
  });
  this.version += 1;
  return await this.save();
};

// Virtual for years of experience
resumeSchema.virtual('totalExperience').get(function() {
  if (!this.experience || this.experience.length === 0) return 0;
  
  const totalMonths = this.experience.reduce((total, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.currentlyWorking ? new Date() : new Date(exp.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    return total + months;
  }, 0);
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal
});

// Virtual for completion percentage
resumeSchema.virtual('completionPercentage').get(function() {
  let completed = 0;
  const totalSections = 10;
  
  if (this.personalInfo && this.personalInfo.fullName) completed++;
  if (this.summary) completed++;
  if (this.experience && this.experience.length > 0) completed++;
  if (this.education && this.education.length > 0) completed++;
  if (this.skills && (this.skills.technical.length > 0 || this.skills.soft.length > 0)) completed++;
  if (this.certifications && this.certifications.length > 0) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.personalInfo && this.personalInfo.linkedin) completed++;
  if (this.personalInfo && this.personalInfo.phone) completed++;
  if (this.personalInfo && this.personalInfo.location) completed++;
  
  return Math.round((completed / totalSections) * 100);
});

export default mongoose.model('Resume', resumeSchema);