import Resume from '../models/Resume.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import {
  generateResumeContent,
  generateProfessionalSummary,
  generateJobDescription,
  improveResumeSection,
  generateCoverLetter,
  suggestKeywords,
  parseResumeText
} from '../utils/aiService.js';
import {
  analyzeResume,
  quickResumeScore,
  checkATSCompatibility,
  extractKeywords,
  calculateCompleteness,
  compareWithJob
} from '../utils/resumeAnalyzer.js';
import {
  calculateJobMatch,
  findMatchingJobs,
  recommendSkills
} from '../utils/jobMatcher.js';

/**
 * @desc    Generate AI Resume
 * @route   POST /api/ai/generate-resume
 * @access  Private (User only)
 */
export const generateAIResume = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = req.body;

    // Get user data if not provided
    let user;
    if (!userData.name) {
      user = await User.findById(userId);
      userData.name = user.name;
      userData.email = user.email;
      userData.phone = user.phone;
    }

    // Generate resume content using AI
    const generatedContent = await generateResumeContent(userData);

    // Create resume record
    const resume = await Resume.create({
      user: userId,
      type: 'ai-generated',
      title: `AI Generated Resume - ${new Date().toLocaleDateString()}`,
      personalInfo: {
        fullName: userData.name,
        email: userData.email,
        phone: userData.phone
      },
      summary: generatedContent.summary,
      experience: generatedContent.experience || [],
      education: generatedContent.education || [],
      skills: generatedContent.skills || {},
      aiGeneration: {
        model: process.env.AI_PROVIDER || 'anthropic',
        generatedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Resume generated successfully',
      resume,
      suggestions: generatedContent.suggestions
    });
  } catch (error) {
    console.error('Generate Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating resume',
      error: error.message
    });
  }
};

/**
 * @desc    Analyze Resume with AI
 * @route   POST /api/ai/analyze-resume
 * @access  Private (User only)
 */
export const analyzeResumeAI = async (req, res) => {
  try {
    const { resumeId, resumeText } = req.body;
    let resumeData;

    // Get resume data
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }
      resumeData = resume.toObject();
    } else if (resumeText) {
      // Parse resume text
      resumeData = await parseResumeText(resumeText);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide resumeId or resumeText'
      });
    }

    // Perform comprehensive analysis
    const analysis = await analyzeResume(resumeData);
    const completeness = calculateCompleteness(resumeData);
    const keywords = extractKeywords(JSON.stringify(resumeData));
    const atsCheck = await checkATSCompatibility(resumeData);

    // Update resume with analysis if resumeId provided
    if (resumeId) {
      await Resume.findByIdAndUpdate(resumeId, {
        analysis: {
          overallScore: analysis.overallScore,
          sections: analysis.sections,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          suggestions: analysis.suggestions,
          keywordAnalysis: analysis.keywordAnalysis,
          analyzedAt: new Date(),
          analyzedBy: process.env.AI_PROVIDER || 'anthropic'
        },
        lastAnalyzed: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      analysis: {
        ...analysis,
        completeness,
        keywords: keywords.keywords,
        keywordFrequency: keywords.frequency,
        atsCompatibility: atsCheck
      }
    });
  } catch (error) {
    console.error('Analyze Resume Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing resume',
      error: error.message
    });
  }
};

/**
 * @desc    Calculate Job Match Score
 * @route   POST /api/ai/match-job
 * @access  Private (User only)
 */
export const calculateMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Calculate match score
    const matchResult = await calculateJobMatch(user, job);

    res.status(200).json({
      success: true,
      message: 'Match calculated successfully',
      match: matchResult
    });
  } catch (error) {
    console.error('Calculate Match Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating job match',
      error: error.message
    });
  }
};

/**
 * @desc    Find Best Matching Jobs
 * @route   GET /api/ai/recommended-jobs
 * @access  Private (User only)
 */
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;

    // Get user profile
    const user = await User.findById(userId);

    // Get all active jobs
    const jobs = await Job.find({ 
      status: 'active',
      approvalStatus: 'approved'
    }).limit(50);

    // Find matching jobs
    const matches = await findMatchingJobs(user, jobs, limit);

    res.status(200).json({
      success: true,
      message: 'Recommended jobs fetched successfully',
      count: matches.length,
      jobs: matches
    });
  } catch (error) {
    console.error('Get Recommended Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended jobs',
      error: error.message
    });
  }
};

/**
 * @desc    Generate Professional Summary
 * @route   POST /api/ai/generate-summary
 * @access  Private (User only)
 */
export const generateSummary = async (req, res) => {
  try {
    const { title, experience, skills, industry } = req.body;

    if (!title || !skills) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and skills'
      });
    }

    const summary = await generateProfessionalSummary({
      title,
      experience: experience || 0,
      skills: Array.isArray(skills) ? skills : [skills],
      industry: industry || 'General'
    });

    res.status(200).json({
      success: true,
      message: 'Summary generated successfully',
      summary
    });
  } catch (error) {
    console.error('Generate Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message
    });
  }
};

/**
 * @desc    Generate Job Description Points
 * @route   POST /api/ai/generate-job-description
 * @access  Private (User only)
 */
export const generateJobDesc = async (req, res) => {
  try {
    const { title, company, responsibilities, skills } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and company'
      });
    }

    const description = await generateJobDescription({
      title,
      company,
      responsibilities,
      skills: Array.isArray(skills) ? skills : []
    });

    res.status(200).json({
      success: true,
      message: 'Job description generated successfully',
      description
    });
  } catch (error) {
    console.error('Generate Job Description Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating job description',
      error: error.message
    });
  }
};

/**
 * @desc    Improve Resume Section
 * @route   POST /api/ai/improve-section
 * @access  Private (User only)
 */
export const improveSection = async (req, res) => {
  try {
    const { sectionName, content } = req.body;

    if (!sectionName || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide section name and content'
      });
    }

    const improved = await improveResumeSection(sectionName, content);

    res.status(200).json({
      success: true,
      message: 'Section improved successfully',
      original: content,
      improved
    });
  } catch (error) {
    console.error('Improve Section Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error improving section',
      error: error.message
    });
  }
};

/**
 * @desc    Generate Cover Letter
 * @route   POST /api/ai/generate-cover-letter
 * @access  Private (User only)
 */
export const generateCoverLetterAI = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId;

    // Get user and job
    const user = await User.findById(userId);
    const job = await Job.findById(jobId).populate('client');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const coverLetter = await generateCoverLetter(
      {
        name: user.name,
        title: user.professional?.title,
        experience: user.professional?.experience,
        skills: user.professional?.skills
      },
      {
        title: job.title,
        company: job.client?.company?.name,
        requirements: job.requirements?.skills
      }
    );

    res.status(200).json({
      success: true,
      message: 'Cover letter generated successfully',
      coverLetter
    });
  } catch (error) {
    console.error('Generate Cover Letter Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating cover letter',
      error: error.message
    });
  }
};

/**
 * @desc    Get Keyword Suggestions
 * @route   POST /api/ai/suggest-keywords
 * @access  Private (User only)
 */
export const getKeywordSuggestions = async (req, res) => {
  try {
    const { industry, jobTitle } = req.body;

    if (!industry || !jobTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide industry and job title'
      });
    }

    const keywords = await suggestKeywords(industry, jobTitle);

    res.status(200).json({
      success: true,
      message: 'Keywords suggested successfully',
      keywords
    });
  } catch (error) {
    console.error('Get Keywords Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error suggesting keywords',
      error: error.message
    });
  }
};

/**
 * @desc    Get Skill Recommendations
 * @route   GET /api/ai/recommend-skills
 * @access  Private (User only)
 */
export const getSkillRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user skills
    const user = await User.findById(userId);
    const currentSkills = user.professional?.skills || [];

    // Get common job requirements in user's field
    const jobs = await Job.find({ 
      status: 'active',
      category: user.professional?.title 
    }).limit(20);

    const allRequiredSkills = jobs.flatMap(job => job.requirements?.skills || []);
    const uniqueRequiredSkills = [...new Set(allRequiredSkills)];

    // Get recommendations
    const recommendations = await recommendSkills(currentSkills, uniqueRequiredSkills);

    res.status(200).json({
      success: true,
      message: 'Skill recommendations fetched successfully',
      currentSkills,
      recommendedSkills: recommendations
    });
  } catch (error) {
    console.error('Get Skill Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching skill recommendations',
      error: error.message
    });
  }
};

export default {
  generateAIResume,
  analyzeResumeAI,
  calculateMatch,
  getRecommendedJobs,
  generateSummary,
  generateJobDesc,
  improveSection,
  generateCoverLetterAI,
  getKeywordSuggestions,
  getSkillRecommendations
};