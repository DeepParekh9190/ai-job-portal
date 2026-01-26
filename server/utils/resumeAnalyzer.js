import { callAI } from './aiService.js';

/**
 * Resume Analyzer
 * Provides detailed analysis and scoring of resumes
 */

/**
 * Comprehensive Resume Analysis
 */
export const analyzeResume = async (resumeData) => {
  const systemPrompt = `You are an expert resume reviewer and ATS specialist. 
Analyze resumes thoroughly and provide actionable feedback.
Output ONLY valid JSON without any markdown formatting.`;

  const prompt = `Analyze this resume comprehensively:

${JSON.stringify(resumeData, null, 2)}

Provide a detailed analysis with scores (0-100) for each category:

1. Formatting & Structure (professional layout, readability, organization)
2. Content Quality (clarity, impact, achievement-focus)
3. Keyword Optimization (industry keywords, ATS compatibility)
4. Grammar & Language (professional tone, no errors)
5. ATS Compatibility (machine readability, proper formatting)

Also provide:
- Overall score (weighted average)
- Top 5 strengths
- Top 5 weaknesses
- 5-7 specific improvement suggestions
- Missing keywords for the industry
- Keyword frequency analysis

Return ONLY a JSON object with this structure:
{
  "overallScore": 85,
  "sections": {
    "formatting": {"score": 90, "feedback": "..."},
    "content": {"score": 85, "feedback": "..."},
    "keywords": {"score": 75, "feedback": "..."},
    "grammar": {"score": 95, "feedback": "..."},
    "atsCompatibility": {"score": 80, "feedback": "..."}
  },
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "keywordAnalysis": {
    "present": ["keyword1", "keyword2", ...],
    "missing": ["keyword1", "keyword2", ...],
    "frequency": [{"keyword": "javascript", "count": 5}, ...]
  }
}`;

  const response = await callAI(prompt, systemPrompt, 4000);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing resume analysis:', error);
    throw new Error('Failed to analyze resume');
  }
};

/**
 * Quick Resume Score (Fast scoring without detailed analysis)
 */
export const quickResumeScore = async (resumeText) => {
  const systemPrompt = 'You are an ATS system. Quickly score resumes from 0-100.';
  
  const prompt = `Score this resume from 0-100 based on:
- Professional formatting
- Content quality
- Keyword presence
- ATS compatibility

Resume:
${resumeText.substring(0, 2000)}

Return ONLY a JSON object:
{
  "score": 85,
  "reason": "brief explanation"
}`;

  const response = await callAI(prompt, systemPrompt, 500);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return { score: 70, reason: 'Unable to provide detailed analysis' };
  }
};

/**
 * Check ATS Compatibility
 */
export const checkATSCompatibility = async (resumeData) => {
  const systemPrompt = 'You are an ATS compatibility expert. Identify issues that prevent resumes from passing ATS systems.';
  
  const prompt = `Check this resume for ATS compatibility issues:

${JSON.stringify(resumeData)}

Identify:
1. Formatting issues (tables, images, complex layouts)
2. Font and styling problems
3. Section header issues
4. Contact information problems
5. File format concerns

Return ONLY a JSON object:
{
  "score": 85,
  "isATSFriendly": true,
  "issues": ["issue 1", "issue 2", ...],
  "recommendations": ["fix 1", "fix 2", ...]
}`;

  const response = await callAI(prompt, systemPrompt, 1500);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return {
      score: 75,
      isATSFriendly: true,
      issues: [],
      recommendations: []
    };
  }
};

/**
 * Extract Keywords from Resume
 */
export const extractKeywords = (resumeText) => {
  // Common resume keywords and skills
  const technicalKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
    'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'agile',
    'machine learning', 'ai', 'data analysis', 'cloud', 'devops'
  ];

  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving',
    'analytical', 'creative', 'organized', 'detail-oriented'
  ];

  const allKeywords = [...technicalKeywords, ...softSkills];
  const resumeLower = resumeText.toLowerCase();
  
  const found = [];
  const frequency = {};

  allKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = resumeLower.match(regex);
    if (matches) {
      found.push(keyword);
      frequency[keyword] = matches.length;
    }
  });

  return {
    keywords: found,
    frequency: Object.entries(frequency).map(([keyword, count]) => ({ keyword, count }))
  };
};

/**
 * Calculate Resume Completeness
 */
export const calculateCompleteness = (resumeData) => {
  let score = 0;
  const maxScore = 100;
  
  // Personal Information (20 points)
  if (resumeData.personalInfo?.fullName) score += 5;
  if (resumeData.personalInfo?.email) score += 5;
  if (resumeData.personalInfo?.phone) score += 5;
  if (resumeData.personalInfo?.location) score += 5;

  // Professional Summary (15 points)
  if (resumeData.summary && resumeData.summary.length > 50) score += 15;

  // Work Experience (25 points)
  if (resumeData.experience?.length > 0) {
    score += 15;
    if (resumeData.experience.length >= 2) score += 5;
    if (resumeData.experience.some(exp => exp.achievements?.length > 0)) score += 5;
  }

  // Education (15 points)
  if (resumeData.education?.length > 0) {
    score += 10;
    if (resumeData.education.length >= 2) score += 5;
  }

  // Skills (15 points)
  const skillsCount = (resumeData.skills?.technical?.length || 0) + 
                      (resumeData.skills?.soft?.length || 0);
  if (skillsCount > 0) score += 5;
  if (skillsCount >= 5) score += 5;
  if (skillsCount >= 10) score += 5;

  // Additional Sections (10 points)
  if (resumeData.certifications?.length > 0) score += 3;
  if (resumeData.projects?.length > 0) score += 3;
  if (resumeData.personalInfo?.linkedin) score += 2;
  if (resumeData.personalInfo?.portfolio) score += 2;

  return Math.min(score, maxScore);
};

/**
 * Compare Resume with Job Requirements
 */
export const compareWithJob = async (resumeData, jobRequirements) => {
  const systemPrompt = 'You are a recruitment matching expert. Compare resumes with job requirements objectively.';
  
  const prompt = `Compare this resume with job requirements:

Resume Summary:
${JSON.stringify({
  experience: resumeData.experience,
  education: resumeData.education,
  skills: resumeData.skills
})}

Job Requirements:
${JSON.stringify(jobRequirements)}

Analyze:
1. Skills match (which required skills are present/missing)
2. Experience match (years and relevance)
3. Education match
4. Overall fit percentage

Return ONLY a JSON object:
{
  "matchScore": 85,
  "skillsMatch": {
    "matched": ["skill1", "skill2"],
    "missing": ["skill3"],
    "score": 80
  },
  "experienceMatch": {
    "required": 3,
    "candidate": 5,
    "relevant": true,
    "score": 90
  },
  "educationMatch": {
    "required": "Bachelor",
    "candidate": "Master",
    "meets": true,
    "score": 100
  },
  "strengths": ["strength 1", "strength 2"],
  "concerns": ["concern 1"],
  "recommendation": "Strong fit | Potential fit | Not recommended"
}`;

  const response = await callAI(prompt, systemPrompt, 2000);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error comparing resume with job:', error);
    return null;
  }
};

/**
 * Detect Resume Gaps
 */
export const detectGaps = (experience) => {
  if (!experience || experience.length < 2) return [];

  const gaps = [];
  const sortedExp = [...experience].sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  );

  for (let i = 0; i < sortedExp.length - 1; i++) {
    const current = sortedExp[i];
    const next = sortedExp[i + 1];
    
    const currentStart = new Date(current.startDate);
    const nextEnd = next.currentlyWorking ? new Date() : new Date(next.endDate);
    
    const gapMonths = (currentStart.getFullYear() - nextEnd.getFullYear()) * 12 +
                      (currentStart.getMonth() - nextEnd.getMonth());
    
    if (gapMonths > 2) {
      gaps.push({
        start: nextEnd,
        end: currentStart,
        months: gapMonths
      });
    }
  }

  return gaps;
};

/**
 * Generate Resume Improvement Plan
 */
export const generateImprovementPlan = async (analysisResults) => {
  const systemPrompt = 'You are a career coach. Create actionable improvement plans for resumes.';
  
  const prompt = `Based on this resume analysis, create a step-by-step improvement plan:

Analysis:
${JSON.stringify(analysisResults)}

Create a prioritized plan with:
1. Quick wins (can be done in 1 hour)
2. Medium-term improvements (1-3 days)
3. Long-term goals (ongoing)

Each item should be specific and actionable.

Return as a JSON array of objects:
[
  {
    "priority": "high|medium|low",
    "timeframe": "quick|medium|long",
    "task": "specific task",
    "impact": "expected improvement"
  }
]`;

  const response = await callAI(prompt, systemPrompt, 1500);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return [];
  }
};

export default {
  analyzeResume,
  quickResumeScore,
  checkATSCompatibility,
  extractKeywords,
  calculateCompleteness,
  compareWithJob,
  detectGaps,
  generateImprovementPlan
};