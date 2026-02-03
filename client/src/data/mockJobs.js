// Mock Jobs Data for Demonstration
export const MOCK_JOBS_LIST = [
  {
    id: 1,
    _id: '1',
    title: "Senior AI Engineer",
    company: "TechFlow India",
    logo: "https://ui-avatars.com/api/?name=TF&background=8b5cf6&color=fff",
    location: "Bengaluru, KA (Remote)",
    type: "Full-time",
    posted: "2 hours ago",
    tags: ["Python", "PyTorch", "LLMs"],
    isHot: true,
    description: `ABOUT THE JOB
We are looking for a visionary Senior AI Engineer to join TechFlow India's core AI research and development team. In this pivotal role, you will lead the architecture and implementation of next-generation Generative AI models that power our enterprise solutions. You will work at the intersection of NLP, Computer Vision, and scalable distributed systems, turning state-of-the-art research into production-ready features.

KEY RESPONSIBILITIES
• Architect & Build: Design, train, and fine-tune Large Language Models (LLMs) and transformer-based architectures for specific domain tasks.
• Productionize AI: Bridge the gap between research and production by optimizing models for latency, throughput, and cost-efficiency using techniques like quantization, distillation, and pruning.
• Innovation: Stay ahead of the curve by researching and implementing the latest papers in GenAI (LoRA, RAG, Agents).
• Collaboration: Work closely with backend engineers to integrate models into our microservices architecture (FastAPI/Python) and with product managers to define AI capabilities.
• Mentorship: Guide junior data scientists and conduct code reviews to maintain high engineering standards.

DATA PRIVACY & ETHICS
• Ensure all AI systems comply with data privacy regulations (GDPR, DPDP) and ethical AI guidelines.
• Implement guardrails to prevent hallucinations and bias in model outputs.`,
    requirements: {
      skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'GenAI', 'RAG', 'LangChain', 'Docker', 'Kubernetes', 'AWS SageMaker'],
      experience: { min: 5, max: 10 },
      education: 'Master'
    },
    jobType: 'full-time',
    salary: { min: 2500000, max: 4500000, currency: 'INR', period: 'yearly' },
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', type: 'remote' },
    client: {
      company: {
        name: 'TechFlow India',
        description: 'TechFlow India is a leading AI and machine learning company focused on building next-generation intelligent systems. We work with Fortune 500 companies to transform their businesses through AI.',
        industry: 'Artificial Intelligence',
        website: 'https://techflow.in'
      }
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    applicants: new Array(47).fill(null)
  },
  {
    id: 2,
    _id: '2',
    title: "Product Designer",
    company: "InnovateBharat",
    logo: "https://ui-avatars.com/api/?name=IB&background=f59e0b&color=fff",
    location: "Mumbai, MH",
    type: "Full-time",
    posted: "5 hours ago",
    tags: ["Figma", "UI/UX", "Prototyping"],
    isHot: false,
    description: `Join our design team as a Product Designer and help create beautiful, intuitive user experiences. You'll work on diverse projects ranging from mobile apps to enterprise software, collaborating with product managers and engineers to bring ideas to life.

We're looking for someone who is passionate about user-centered design and has a strong portfolio showcasing their work. You'll have the opportunity to influence product direction and make a real impact on millions of users.`,
    requirements: {
      skills: ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems'],
      experience: { min: 3, max: 7 },
      education: 'Bachelor'
    },
    jobType: 'full-time',
    salary: { min: 1800000, max: 2800000, currency: 'INR', period: 'yearly' },
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', type: 'onsite' },
    client: {
      company: {
        name: 'InnovateBharat',
        description: 'InnovateBharat is a product design and development studio creating world-class digital experiences for Indian and global markets.',
        industry: 'Design & Technology',
        website: 'https://innovatebharat.com'
      }
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    applicants: new Array(32).fill(null)
  },
  {
    id: 3,
    _id: '3',
    title: "Machine Learning Ops Engineer",
    company: "DataSphere",
    logo: "https://ui-avatars.com/api/?name=DS&background=10b981&color=fff",
    location: "Remote",
    type: "Contract",
    posted: "1 day ago",
    tags: ["AWS", "Docker", "Kubernetes"],
    isHot: false,
    description: `We're seeking an experienced MLOps Engineer to build and maintain our machine learning infrastructure. You'll be responsible for deploying, monitoring, and scaling ML models in production environments.

This role requires strong DevOps skills combined with ML knowledge. You'll work closely with data scientists to streamline the ML lifecycle and ensure our models run efficiently at scale.`,
    requirements: {
      skills: ['AWS', 'Docker', 'Kubernetes', 'Python', 'CI/CD', 'MLflow', 'Terraform'],
      experience: { min: 4, max: 8 },
      education: 'Bachelor'
    },
    jobType: 'contract',
    salary: { min: 2200000, max: 3500000, currency: 'INR', period: 'yearly' },
    location: { city: 'Remote', country: 'India', type: 'remote' },
    client: {
      company: {
        name: 'DataSphere',
        description: 'DataSphere provides enterprise data science and ML solutions, helping companies leverage their data for competitive advantage.',
        industry: 'Data Science',
        website: 'https://datasphere.io'
      }
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    applicants: new Array(28).fill(null)
  },
  {
    id: 4,
    _id: '4',
    title: "Frontend Developer",
    company: "FutureScale",
    logo: "https://ui-avatars.com/api/?name=FS&background=ec4899&color=fff",
    location: "Pune, MH",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["React", "TypeScript", "Tailwind"],
    isHot: true,
    description: `Join our frontend team and build modern, responsive web applications using React and TypeScript. You'll work on exciting projects that push the boundaries of web technology.

We're looking for developers who are passionate about creating exceptional user experiences and writing clean, maintainable code. You'll have the opportunity to work with the latest frontend technologies and frameworks.`,
    requirements: {
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'Git', 'REST APIs'],
      experience: { min: 2, max: 5 },
      education: 'Bachelor'
    },
    jobType: 'full-time',
    salary: { min: 1200000, max: 2000000, currency: 'INR', period: 'yearly' },
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', type: 'hybrid' },
    client: {
      company: {
        name: 'FutureScale',
        description: 'FutureScale is a fast-growing startup building the next generation of SaaS products for modern businesses.',
        industry: 'Software Development',
        website: 'https://futurescale.tech'
      }
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: new Array(56).fill(null)
  },
  // Add more mock jobs as needed (5-24)
];

// Helper function to generate fallback job data for IDs 5-24 and beyond (infinite scroll)
const generateFallbackJob = (id) => {
  const numericId = parseInt(id);
  // Map any ID > 24 back to 1-24 range to reuse our high-quality templates
  // (ID 25 -> 1, ID 26 -> 2, etc.)
  const templateId = ((numericId - 1) % 24) + 1;
  const jobId = templateId.toString();
  
  // First try to get from the main list (for 1-4)
  const existingJob = MOCK_JOBS_LIST.find(j => j.id === templateId);
  if (existingJob) {
    return {
      ...existingJob,
      id: numericId, // Keep the new unique ID
      _id: numericId.toString(),
      isMock: true
    };
  }

  const jobsData = {
    5: { title: "Data Scientist", company: "NeuralNet", tags: ["R", "SQL", "Statistics"], salary: "₹20L - ₹32L", location: "Hyderabad, TG" },
    6: { title: "AI Ethics Researcher", company: "CyberPeak", tags: ["Research", "Ethics", "Policy"], salary: "₹15L - ₹25L", location: "Gurgaon, HR (Remote)" },
    7: { title: "Full Stack Developer", company: "CloudNine Technologies", tags: ["Node.js", "React", "MongoDB"], salary: "₹15L - ₹25L", location: "Bengaluru, KA" },
    8: { title: "DevOps Engineer", company: "ScaleOps", tags: ["Jenkins", "Terraform", "CI/CD"], salary: "₹18L - ₹30L", location: "Remote" },
    9: { title: "Mobile App Developer (iOS)", company: "AppCraft Studios", tags: ["Swift", "SwiftUI", "iOS"], salary: "₹14L - ₹22L", location: "Chennai, TN" },
    10: { title: "Blockchain Developer", company: "CryptoVerse", tags: ["Solidity", "Web3", "Ethereum"], salary: "₹20L - ₹35L", location: "Mumbai, MH (Hybrid)" },
    11: { title: "UX Researcher", company: "UserFirst Design", tags: ["User Testing", "Analytics", "Research"], salary: "₹12L - ₹18L", location: "Pune, MH" },
    12: { title: "Cloud Architect", company: "SkyTech Solutions", tags: ["Azure", "AWS", "GCP"], salary: "₹30L - ₹50L", location: "Bengaluru, KA" },
    13: { title: "Backend Engineer (Python)", company: "DataFlow Inc", tags: ["Python", "Django", "PostgreSQL"], salary: "₹16L - ₹28L", location: "Remote" },
    14: { title: "Cybersecurity Analyst", company: "SecureNet", tags: ["Penetration Testing", "SIEM", "Security"], salary: "₹18L - ₹32L", location: "Delhi, DL" },
    15: { title: "QA Automation Engineer", company: "TestPro Labs", tags: ["Selenium", "Cypress", "Testing"], salary: "₹10L - ₹18L", location: "Hyderabad, TG" },
    16: { title: "Technical Writer", company: "DocuTech", tags: ["Documentation", "API Docs", "Writing"], salary: "₹8L - ₹15L", location: "Remote" },
    17: { title: "Computer Vision Engineer", company: "VisionAI", tags: ["OpenCV", "TensorFlow", "Deep Learning"], salary: "₹22L - ₹40L", location: "Bengaluru, KA (Hybrid)" },
    18: { title: "Product Manager", company: "ProductHub", tags: ["Product Strategy", "Roadmap", "Agile"], salary: "₹25L - ₹45L", location: "Mumbai, MH" },
    19: { title: "Game Developer (Unity)", company: "PlayForge Studios", tags: ["Unity", "C#", "Game Design"], salary: "₹12L - ₹22L", location: "Pune, MH" },
    20: { title: "Data Engineer", company: "BigData Corp", tags: ["Spark", "Hadoop", "ETL"], salary: "₹18L - ₹30L", location: "Bengaluru, KA" },
    21: { title: "NLP Engineer", company: "LanguageTech", tags: ["NLP", "Transformers", "BERT"], salary: "₹20L - ₹38L", location: "Remote" },
    22: { title: "Android Developer", company: "MobileFirst", tags: ["Kotlin", "Jetpack Compose", "Android"], salary: "₹13L - ₹21L", location: "Hyderabad, TG" },
    23: { title: "Site Reliability Engineer", company: "ReliableOps", tags: ["SRE", "Monitoring", "Incident Response"], salary: "₹22L - ₹38L", location: "Bengaluru, KA" },
    24: { title: "AI Research Scientist", company: "DeepMind India", tags: ["Research", "ML", "Publications"], salary: "₹35L - ₹60L", location: "Bengaluru, KA" },
  };

  const jobData = jobsData[jobId] || jobsData[5]; // Default fallback
  if (!jobData) return null;

  return {
    _id: jobId.toString(),
    id: jobId,
    title: jobData.title,
    description: `We are seeking a talented ${jobData.title} to join our innovative team. You'll work on cutting-edge projects, collaborating with cross-functional teams to deliver exceptional results.

In this role, you'll have the opportunity to work with the latest technologies and contribute to meaningful projects that impact millions of users. We're looking for someone passionate about technology and eager to make a difference.

As a ${jobData.title}, you will be at the forefront of innovation, working with state-of-the-art tools and frameworks. Your expertise will help shape the future of our products and services.`,
    requirements: {
      skills: jobData.tags,
      experience: { min: 3, max: 7 },
      education: 'Bachelor'
    },
    jobType: 'full-time',
    salary: { 
      min: parseInt(jobData.salary.match(/₹(\d+)L/)[1]) * 100000, 
      max: parseInt(jobData.salary.match(/- ₹(\d+)L/)[1]) * 100000, 
      currency: 'INR', 
      period: 'yearly' 
    },
    location: { 
      city: jobData.location.split(',')[0], 
      country: 'India', 
      type: jobData.location.includes('Remote') ? 'remote' : 'onsite' 
    },
    client: {
      company: {
        name: jobData.company,
        description: `${jobData.company} is a leading technology company focused on innovation and digital transformation. We work with top companies to build next-generation solutions.`,
        industry: 'Technology',
        website: `https://${jobData.company.toLowerCase().replace(/\s+/g, '')}.com`
      }
    },
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: new Array(Math.floor(Math.random() * 60) + 20).fill(null),
    isMock: true
  };
};

// Helper function to get mock job by ID (retuns specific or fallback)
export const getMockJobById = (id) => {
  const numericId = parseInt(id);
  // First try to find in specific mock list
  const specificMock = MOCK_JOBS_LIST.find(job => job.id === numericId || job._id === id);
  
  if (specificMock) return specificMock;
  
  // If not found, generate a fallback
  return generateFallbackJob(id);
};

// Helper function to get all mock jobs
export const getAllMockJobs = () => {
  return MOCK_JOBS_LIST;
};
