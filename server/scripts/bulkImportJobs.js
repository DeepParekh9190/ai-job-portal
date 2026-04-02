import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../models/Client.js';
import Job from '../models/Job.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

const jobKeywords = {
  'Software Development': ['Senior React Developer', 'Node.js Backend Engineer', 'Full Stack Architect', 'Python AI Engineer', 'Java Spring Boot Developer', 'Flutter Mobile Lead', 'DevOps Specialist (AWS)', 'Cloud Security Architect'],
  'Design': ['UX/UI Designer', 'Product Designer', 'Graphics Lead', 'Motion Graphics Artist', 'Brand Designer', 'Interaction Designer'],
  'Data Science': ['Data Scientist', 'Business Intelligence Analyst', 'ML Engineer', 'Data Analyst', 'Big Data Architect'],
  'Marketing': ['SEO Expert', 'Digital Marketing Lead', 'Content Strategist', 'Growth Hacker', 'Social Media Manager', 'Performance Marketer'],
  'Product Management': ['Product Manager', 'Project Lead', 'Engineering Manager', 'Scrum Master', 'Operations Manager', 'HR Manager'],
  'Sales': ['B2B Sales Executive', 'Account Manager', 'Business Development Rep', 'Customer Success Lead']
};

const locations = [
  { type: 'onsite', city: 'Mumbai', country: 'India' },
  { type: 'onsite', city: 'Bengaluru', country: 'India' },
  { type: 'onsite', city: 'Delhi', country: 'India' },
  { type: 'onsite', city: 'Hyderabad', country: 'India' },
  { type: 'remote', city: 'WFH', country: 'Remote' },
  { type: 'hybrid', city: 'Pune', country: 'India' },
  { type: 'onsite', city: 'Chennai', country: 'India' },
  { type: 'hybrid', city: 'Ahmedabad', country: 'India' }
];

const bulkImport = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for Job Import');

    const clients = await Client.find({});
    if (clients.length === 0) {
      console.warn('⚠️ No clients found in database. Run "npm run seedData" first!');
      process.exit(0);
    }

    console.log(`🧹 Clearing existing jobs...`);
    await Job.deleteMany({});

    console.log(`🚀 Spawning 100+ Professional Jobs...`);
    const jobsToInsert = [];
    
    // Distribute 105 jobs among the existing clients
    for (let i = 0; i < 105; i++) {
        const client = clients[i % clients.length];
        const category = Object.keys(jobKeywords)[Math.floor(Math.random() * Object.keys(jobKeywords).length)];
        const title = jobKeywords[category][Math.floor(Math.random() * jobKeywords[category].length)];
        const loc = locations[Math.floor(Math.random() * locations.length)];
        
        const salaryMin = 500000 + (Math.floor(Math.random() * 20) * 100000);
        const salaryMax = salaryMin + 500000 + (Math.floor(Math.random() * 10) * 100000);
        
        const deadline = new Date(Date.now() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000);
        const expiry = new Date(deadline.getTime() + (30 * 24 * 60 * 60 * 1000)); // Expires 30 days after deadline

        jobsToInsert.push({
            client: client._id,
            title,
            description: `We are looking for a highly skilled ${title} to join our ${category} team. You'll be working with cutting-edge technologies to solve complex problems and build some truly amazing products.`,
            jobType: i % 10 === 0 ? 'contract' : 'full-time',
            category,
            location: loc,
            salary: {
                min: salaryMin,
                max: salaryMax,
                currency: 'INR',
                period: 'yearly'
            },
            requirements: {
                experience: { min: 2 + (Math.floor(Math.random() * 5)) },
                education: 'Bachelor',
                skills: ['Communication', 'Teamwork', title.split(' ')[0], category.split(' ')[0]]
            },
            applicationDeadline: deadline,
            expiresAt: expiry,
            status: 'active',
            approvalStatus: 'approved',
            isFeatured: i < 10 // Using isFeatured instead of isHot to match schema
        });
    }

    await Job.insertMany(jobsToInsert);
    console.log(`✨ DONE! Successfully imported ${jobsToInsert.length} jobs into the database.`);
    
    // Add seed script to root package.json if it isn't there already (though we added one earlier)
    process.exit(0);
  } catch (error) {
    console.error('❌ Bulk Import Failed:', error.message);
    process.exit(1);
  }
};

bulkImport();
