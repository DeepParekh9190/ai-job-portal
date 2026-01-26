import axios from 'axios';

/**
 * AI Service Integration
 * Handles communication with AI APIs (Anthropic Claude or OpenAI)
 */

const AI_PROVIDER = process.env.AI_PROVIDER || 'anthropic'; // 'anthropic' or 'openai'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Call Anthropic Claude API
 */
const callClaude = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    throw new Error('Anthropic API key is not configured');
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error.response?.data || error.message);
    throw new Error(`Failed to call Claude API: ${error.response?.data?.error?.message || error.message}`);
  }
};

/**
 * Call OpenAI API
 */
const callOpenAI = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error(`Failed to call OpenAI API: ${error.response?.data?.error?.message || error.message}`);
  }
};

/**
 * Main AI Call Function - Routes to appropriate provider
 */
export const callAI = async (prompt, systemPrompt = '', maxTokens = 2000) => {
  if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
    return await callClaude(prompt, systemPrompt, maxTokens);
  } else if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
    return await callOpenAI(prompt, systemPrompt, maxTokens);
  } else {
    throw new Error('No AI provider configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY');
  }
};

/**
 * Generate Professional Resume Content
 */
export const generateResumeContent = async (userData) => {
  const systemPrompt = `You are a professional resume writer with expertise in creating ATS-friendly, compelling resumes. 
Your task is to generate professional resume content based on the user's information.
Output ONLY valid JSON without any markdown formatting or code blocks.`;

  const prompt = `Create a professional resume for the following person:

Name: ${userData.name}
Email: ${userData.email}
Phone: ${userData.phone || 'Not provided'}
Job Title: ${userData.jobTitle || 'Professional'}

Professional Summary: ${userData.summary || 'Create a compelling 3-4 line professional summary'}

Work Experience: ${JSON.stringify(userData.experience || [])}

Education: ${JSON.stringify(userData.education || [])}

Skills: ${JSON.stringify(userData.skills || [])}

Generate a complete, professional resume with:
1. A compelling professional summary (3-4 sentences)
2. Well-written work experience descriptions with achievements
3. Properly formatted education section
4. Organized skills section
5. Professional formatting suggestions

Return ONLY a JSON object with this structure:
{
  "summary": "professional summary text",
  "experience": [{"title": "", "company": "", "duration": "", "description": "", "achievements": []}],
  "education": [{"degree": "", "institution": "", "year": ""}],
  "skills": {"technical": [], "soft": []},
  "suggestions": []
}`;

  const response = await callAI(prompt, systemPrompt, 3000);
  
  try {
    // Clean response - remove markdown code blocks if present
    let cleanResponse = response.trim();
    cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI-generated resume content');
  }
};

/**
 * Generate Professional Summary
 */
export const generateProfessionalSummary = async (userInfo) => {
  const systemPrompt = 'You are a professional resume writer. Create compelling, ATS-friendly professional summaries.';
  
  const prompt = `Create a professional summary (3-4 sentences) for:
Job Title: ${userInfo.title}
Years of Experience: ${userInfo.experience} years
Key Skills: ${userInfo.skills.join(', ')}
Industry: ${userInfo.industry || 'General'}

Make it compelling, achievement-focused, and ATS-friendly.`;

  return await callAI(prompt, systemPrompt, 500);
};

/**
 * Generate Job Description Bullet Points
 */
export const generateJobDescription = async (jobInfo) => {
  const systemPrompt = 'You are a professional resume writer. Create compelling job description bullet points with quantifiable achievements.';
  
  const prompt = `Create 4-5 professional bullet points for this role:
Job Title: ${jobInfo.title}
Company: ${jobInfo.company}
Key Responsibilities: ${jobInfo.responsibilities || 'General duties'}
Technologies/Skills: ${jobInfo.skills?.join(', ') || 'Various'}

Make each bullet point:
- Start with action verbs
- Include quantifiable achievements when possible
- Be specific and results-oriented
- Be ATS-friendly

Return as a JSON array of strings.`;

  const response = await callAI(prompt, systemPrompt, 800);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return response.split('\n').filter(line => line.trim());
  }
};

/**
 * Improve Resume Section
 */
export const improveResumeSection = async (sectionName, currentContent) => {
  const systemPrompt = 'You are a professional resume editor. Improve resume sections to be more professional, compelling, and ATS-friendly.';
  
  const prompt = `Improve this ${sectionName} section of a resume:

Current Content:
${currentContent}

Make it:
- More professional and polished
- Achievement and results-focused
- ATS-friendly with relevant keywords
- Concise but impactful

Return the improved version.`;

  return await callAI(prompt, systemPrompt, 1000);
};

/**
 * Generate Cover Letter
 */
export const generateCoverLetter = async (userData, jobData) => {
  const systemPrompt = 'You are a professional cover letter writer. Create compelling, personalized cover letters.';
  
  const prompt = `Write a professional cover letter for:

Applicant:
- Name: ${userData.name}
- Title: ${userData.title}
- Experience: ${userData.experience} years
- Key Skills: ${userData.skills?.join(', ')}

Job:
- Position: ${jobData.title}
- Company: ${jobData.company}
- Requirements: ${jobData.requirements?.join(', ')}

Create a compelling 3-paragraph cover letter that:
1. Opens with enthusiasm and specific interest in the role
2. Highlights relevant experience and achievements
3. Closes with a strong call to action

Make it professional, personalized, and enthusiastic.`;

  return await callAI(prompt, systemPrompt, 1500);
};

/**
 * Suggest Keywords for Industry
 */
export const suggestKeywords = async (industry, jobTitle) => {
  const systemPrompt = 'You are an ATS and recruitment expert. Suggest relevant keywords for resumes.';
  
  const prompt = `Suggest 15-20 important keywords for a resume in:
Industry: ${industry}
Job Title: ${jobTitle}

Focus on:
- Technical skills
- Soft skills
- Industry-specific terms
- Common job requirements
- ATS-friendly keywords

Return as a JSON array of strings.`;

  const response = await callAI(prompt, systemPrompt, 800);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    return [];
  }
};

/**
 * Parse Resume Text
 */
export const parseResumeText = async (resumeText) => {
  const systemPrompt = 'You are an expert at parsing resumes. Extract structured information from resume text.';
  
  const prompt = `Parse this resume and extract structured information:

${resumeText}

Extract and return ONLY a JSON object with:
{
  "name": "full name",
  "email": "email",
  "phone": "phone",
  "summary": "professional summary",
  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
  "education": [{"degree": "", "institution": "", "year": ""}],
  "skills": [],
  "certifications": []
}`;

  const response = await callAI(prompt, systemPrompt, 3000);
  
  try {
    let cleanResponse = response.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume content');
  }
};

export default {
  callAI,
  generateResumeContent,
  generateProfessionalSummary,
  generateJobDescription,
  improveResumeSection,
  generateCoverLetter,
  suggestKeywords,
  parseResumeText
};