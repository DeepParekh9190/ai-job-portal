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
import { callAI as callAIService } from '../utils/aiService.js';

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
      experience: (generatedContent.experience || []).map(exp => ({
        jobTitle: exp.title || "Experience",
        company: exp.company || "Company",
        description: exp.description || "",
        achievements: exp.achievements || [],
        startDate: new Date() // Fallback for schema required dates
      })),
      education: (generatedContent.education || []).map(edu => ({
        degree: edu.degree || "Degree",
        institution: edu.institution || "Institution",
        startDate: new Date() // Fallback
      })),
      skills: {
        technical: (generatedContent.skills?.technical || []).map(skill => ({
          name: typeof skill === 'string' ? skill : (skill.name || ""),
          level: 'intermediate'
        })),
        soft: generatedContent.skills?.soft || []
      },
      aiGeneration: {
        model: 'gemini-2.5-flash',
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

    // AI Match Explainer for top 3
    const augmentedMatches = await Promise.all(matches.slice(0, 3).map(async (job) => {
      const explainPrompt = `Current User Skills: ${user.skills.join(', ')}.
        Job: ${job.title} at ${job.company}.
        Requirements: ${job.requirements?.join(', ')}.
        Explain in 1 short, exciting sentence why this is a good fit.`;
      
      try {
        const reason = await callAIService(explainPrompt, "You are a career matching AI. Be brief and professional.", 60);
        return { ...job, aiReason: reason };
      } catch (err) {
        return job;
      }
    }));

    // Recombine (top 3 with reason, rest as is)
    const finalResults = [
      ...augmentedMatches,
      ...matches.slice(3)
    ];

    res.status(200).json({
      success: true,
      message: 'Recommended jobs fetched successfully',
      count: finalResults.length,
      jobs: finalResults
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
        title: user.professional?.title || 'Professional',
        experience: user.professional?.experience || 0,
        skills: user.professional?.skills || []
      },
      {
        title: job.title,
        company: job.client?.company?.name || 'Company',
        requirements: job.requirements?.skills || []
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

/**
 * @desc    Chat with AI Support
 * @route   POST /api/ai/chat
 * @access  Public
 */
export const chatWithAI = async (req, res) => {
  try {
    const { message, history, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message'
      });
    }

    // Default system prompt
    let systemPrompt = `You are Talentora AI, the expert career assistant for TalentoraAI (a premium job portal).
Your primary goal is to help users with:
- Finding jobs that match their skills.
- Optimizing their professional resumes.
- Answering questions about the TalentoraAI platform.
- Providing career advice.
Tone: Premium, helpful, and tech-forward.`;

    // Specialized context for Mock Interview
    if (context === 'mock_interview') {
      systemPrompt = `You are acting as a Senior Technical Recruiter and Hiring Manager at an elite tech firm.
You are conducting a professional Mock Interview for a TalentoraAI user.
Instructions:
1. If the user hasn't specified a target role, ask: "What role would you like to interview for today?"
2. Once the role is known, ask exactly ONE challenging behavioral or technical question at a time.
3. After the user answers, provide:
   - "Feedback": A brief evaluation of their response.
   - "Next Question": The next interview question.
4. Keep the experience rigorous, realistic, and professional.`;
    }

    // Specialized context for Resume Voice Update
    if (context === 'resume_voice_update') {
      systemPrompt = `You are a professional resume parser and writer. 
      The user will provide a spoken transcript of their work experience or skills.
      Your task is to transform this raw, informal text into:
      - A professional, high-impact summary (if they describe their background).
      - OR a comma-separated list of technical/soft skills (if they list skills).
      Be concise and direct. Output ONLY the improved text without conversational filler.`;
    }

    // Construct history for AI context if provided
    let fullPrompt = message;
    if (history && Array.isArray(history)) {
      const historyContext = history.map(h => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n');
      fullPrompt = `Conversation History:\n${historyContext}\n\nUser: ${message}`;
    }

    const aiResponse = await callAIService(fullPrompt, systemPrompt, 1000);

    res.status(200).json({
      success: true,
      message: 'Response generated',
      response: aiResponse
    });
  } catch (error) {
    console.error('❌ AI Chat Critical Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI response',
      error: error.message || 'Internal AI service error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
  getSkillRecommendations,
  chatWithAI
};