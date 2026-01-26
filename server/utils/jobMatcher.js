import { callAI } from './aiService.js';

/**
 * Job Matching System
 * AI-powered matching between candidates and jobs
 */

/**
 * Calculate Job Match Score with AI
 */
export const calculateJobMatch = async (candidateProfile, jobPosting) => {
  const systemPrompt = `You are an expert recruitment AI. Calculate accurate job match scores by analyzing candidate qualifications against job requirements.
Focus on skills, experience, education, and cultural fit.
Output ONLY valid JSON without markdown formatting.`;

  const prompt = `Calculate match score between candidate and job:

CANDIDATE PROFILE:
Name: ${candidateProfile.name}
Title: ${candidateProfile.professional?.title || 'N/A'}
Experience: ${candidateProfile.professional?.experience || 0} years
Skills: ${JSON.stringify(candidateProfile.professional?.skills || [])}
Education: ${JSON.stringify(candidateProfile.professional?.education || [])}
Location: ${candidateProfile.profile?.location?.city || 'N/A'}

JOB POSTING:
Title: ${jobPosting.title}
Required Experience: ${jobPosting.requirements?.experience?.min || 0} - ${jobPosting.requirements?.experience?.max || 'N/A'} years
Required Skills: ${JSON.stringify(jobPosting.requirements?.skills || [])}
Education: ${jobPosting.requirements?.education || 'N/A'}
Location: ${jobPosting.location?.city || 'Remote'}
Salary: ${jobPosting.salary?.min || 0} - ${jobPosting.salary?.max || 0} ${jobPosting.salary?.currency || 'USD'}

Calculate comprehensive match analysis with:

1. Overall Match Score (0-100)
2. Skills Match - which skills match, which are missing, additional skills
3. Experience Match - if candidate meets experience requirements
4. Education Match - if candidate meets education requirements
5. Location Match - if location is compatible
6. Salary Expectations Match
7. Top 3 strengths for this role
8. Top 3 concerns or gaps
9. Overall recommendation (Excellent Fit | Good Fit | Potential Fit | Not Recommended)

Return ONLY this JSON structure:
{
  "overallScore": 85,
  "breakdown": {
    "skills": {
      "score": 80,
      "matched": ["skill1", "skill2"],
      "missing": ["skill3"],
      "additional": ["skill4"]
    },
    "experience": {
      "score": 90,
      "required": 3,
      "candidate": 5,
      "meets": true
    },
    "education": {
      "score": 85,
      "required": "Bachelor",
      "candidate": "Master",
      "meets": true
    },
    "location": {
      "score": 100,
      "compatible": true
    },
    "salary": {
      "score": 75,
      "expectationMatch": "within range"
    }
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "concerns": ["concern 1", "concern 2", "concern 3"],
  "recommendation": "Good Fit",
  "detailedAnalysis": "brief paragraph explaining the match"
}`;

  const response = await callAI(prompt, systemPrompt, 3000);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error calculating job match:', error);
    // Fallback to basic matching if AI fails
    return calculateBasicMatch(candidateProfile, jobPosting);
  }
};

/**
 * Basic Match Calculation (Fallback without AI)
 */
export const calculateBasicMatch = (candidateProfile, jobPosting) => {
  let totalScore = 0;
  const weights = {
    skills: 40,
    experience: 30,
    education: 20,
    location: 10
  };

  // Skills Match
  const candidateSkills = (candidateProfile.professional?.skills || []).map(s => s.toLowerCase());
  const requiredSkills = (jobPosting.requirements?.skills || []).map(s => s.toLowerCase());
  const matchedSkills = requiredSkills.filter(skill => 
    candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs))
  );
  const skillsScore = requiredSkills.length > 0 
    ? (matchedSkills.length / requiredSkills.length) * weights.skills 
    : weights.skills;
  totalScore += skillsScore;

  // Experience Match
  const candidateExp = candidateProfile.professional?.experience || 0;
  const requiredExp = jobPosting.requirements?.experience?.min || 0;
  const experienceScore = candidateExp >= requiredExp 
    ? weights.experience 
    : (candidateExp / requiredExp) * weights.experience;
  totalScore += experienceScore;

  // Education Match
  const educationLevels = ['High School', 'Associate', 'Bachelor', 'Master', 'PhD'];
  const candidateEdu = candidateProfile.professional?.education?.[0]?.degree || 'Bachelor';
  const requiredEdu = jobPosting.requirements?.education || 'Bachelor';
  const candidateLevel = educationLevels.indexOf(candidateEdu);
  const requiredLevel = educationLevels.indexOf(requiredEdu);
  const educationScore = candidateLevel >= requiredLevel ? weights.education : weights.education * 0.5;
  totalScore += educationScore;

  // Location Match
  const locationScore = jobPosting.location?.type === 'remote' ? weights.location : weights.location * 0.8;
  totalScore += locationScore;

  return {
    overallScore: Math.round(totalScore),
    breakdown: {
      skills: {
        score: Math.round(skillsScore / weights.skills * 100),
        matched: matchedSkills,
        missing: requiredSkills.filter(s => !matchedSkills.includes(s)),
        additional: candidateSkills.filter(s => !requiredSkills.includes(s)).slice(0, 3)
      },
      experience: {
        score: Math.round(experienceScore / weights.experience * 100),
        required: requiredExp,
        candidate: candidateExp,
        meets: candidateExp >= requiredExp
      },
      education: {
        score: Math.round(educationScore / weights.education * 100),
        required: requiredEdu,
        candidate: candidateEdu,
        meets: candidateLevel >= requiredLevel
      },
      location: {
        score: Math.round(locationScore / weights.location * 100),
        compatible: true
      }
    },
    strengths: [
      matchedSkills.length > 0 ? `${matchedSkills.length} matching skills` : 'Transferable skills',
      candidateExp >= requiredExp ? 'Meets experience requirement' : 'Growing experience',
      'Motivated candidate'
    ],
    concerns: [
      matchedSkills.length < requiredSkills.length ? 'Some skill gaps' : null,
      candidateExp < requiredExp ? 'Below required experience' : null
    ].filter(Boolean),
    recommendation: totalScore >= 80 ? 'Excellent Fit' : 
                   totalScore >= 65 ? 'Good Fit' : 
                   totalScore >= 50 ? 'Potential Fit' : 'Not Recommended',
    detailedAnalysis: `Candidate has ${matchedSkills.length} of ${requiredSkills.length} required skills and ${candidateExp} years of experience.`
  };
};

/**
 * Find Best Matching Jobs for Candidate
 */
export const findMatchingJobs = async (candidateProfile, availableJobs, limit = 10) => {
  const matches = [];

  for (const job of availableJobs) {
    try {
      const matchResult = await calculateBasicMatch(candidateProfile, job);
      matches.push({
        job,
        matchScore: matchResult.overallScore,
        matchDetails: matchResult
      });
    } catch (error) {
      console.error(`Error matching job ${job._id}:`, error);
    }
  }

  // Sort by match score and return top matches
  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

/**
 * Get Match Explanation
 */
export const getMatchExplanation = async (matchScore, strengths, concerns) => {
  const systemPrompt = 'You are a career counselor. Explain job matches to candidates in an encouraging, helpful way.';
  
  const prompt = `Explain this job match to the candidate:

Match Score: ${matchScore}%
Strengths: ${strengths.join(', ')}
Concerns: ${concerns.join(', ')}

Write a brief, encouraging 2-3 sentence explanation of:
1. Why this is a good/okay/weak match
2. What makes them a strong candidate
3. What they might want to improve (if applicable)

Be positive and constructive.`;

  try {
    return await callAI(prompt, systemPrompt, 500);
  } catch (error) {
    return `This is a ${matchScore >= 80 ? 'strong' : matchScore >= 60 ? 'good' : 'potential'} match for you based on your skills and experience.`;
  }
};

/**
 * Recommend Skills to Learn
 */
export const recommendSkills = async (candidateSkills, jobRequirements) => {
  const systemPrompt = 'You are a career development advisor. Recommend skills for candidates to learn.';
  
  const prompt = `Candidate has these skills: ${candidateSkills.join(', ')}

Job market requires: ${jobRequirements.join(', ')}

Recommend 5 skills they should learn to improve their marketability.
Prioritize skills that:
1. Are in high demand
2. Build on their existing knowledge
3. Are not too difficult to learn
4. Have good career impact

Return as JSON array: ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"]`;

  try {
    const response = await callAI(prompt, systemPrompt, 500);
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return jobRequirements.filter(skill => !candidateSkills.includes(skill)).slice(0, 5);
  }
};

/**
 * Calculate Career Growth Potential
 */
export const calculateCareerGrowth = (currentRole, targetRole) => {
  const seniorityLevels = {
    'intern': 1,
    'junior': 2,
    'mid-level': 3,
    'senior': 4,
    'lead': 5,
    'manager': 6,
    'director': 7,
    'vp': 8,
    'c-level': 9
  };

  const currentLevel = Object.entries(seniorityLevels).find(([key]) => 
    currentRole.toLowerCase().includes(key)
  )?.[1] || 3;

  const targetLevel = Object.entries(seniorityLevels).find(([key]) => 
    targetRole.toLowerCase().includes(key)
  )?.[1] || 3;

  const growthSteps = targetLevel - currentLevel;

  return {
    currentLevel,
    targetLevel,
    growthSteps,
    isGrowthOpportunity: growthSteps > 0,
    isLateralMove: growthSteps === 0,
    isDowngrade: growthSteps < 0
  };
};

/**
 * Batch Match Multiple Candidates to One Job
 */
export const batchMatchCandidates = async (candidates, job) => {
  const results = [];

  for (const candidate of candidates) {
    try {
      const match = await calculateBasicMatch(candidate, job);
      results.push({
        candidateId: candidate._id,
        candidateName: candidate.name,
        matchScore: match.overallScore,
        recommendation: match.recommendation,
        strengths: match.strengths,
        concerns: match.concerns
      });
    } catch (error) {
      console.error(`Error matching candidate ${candidate._id}:`, error);
    }
  }

  // Sort by match score
  return results.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Generate Interview Questions Based on Match
 */
export const generateInterviewQuestions = async (matchDetails, jobTitle) => {
  const systemPrompt = 'You are a recruitment expert. Generate relevant interview questions.';
  
  const concerns = matchDetails.concerns || [];
  const strengths = matchDetails.strengths || [];

  const prompt = `Generate 5 interview questions for a ${jobTitle} candidate with:

Strengths: ${strengths.join(', ')}
Areas to probe: ${concerns.join(', ')}

Create questions that:
1. Verify their strengths
2. Address any concerns
3. Assess cultural fit
4. Evaluate problem-solving

Return as JSON array of objects:
[
  {
    "question": "the question",
    "purpose": "what you're assessing",
    "followUp": "optional follow-up question"
  }
]`;

  try {
    const response = await callAI(prompt, systemPrompt, 1000);
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return [];
  }
};

export default {
  calculateJobMatch,
  calculateBasicMatch,
  findMatchingJobs,
  getMatchExplanation,
  recommendSkills,
  calculateCareerGrowth,
  batchMatchCandidates,
  generateInterviewQuestions
};