import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Client from '../models/Client.js';
import Job from '../models/Job.js';
import connectDB from '../config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Client.deleteMany();
    await Job.deleteMany();

    console.log('🗑️ Existing data cleared');

    // Create a demo client
    const client = await Client.create({
      name: 'TechFlow Admin',
      email: 'client@techflow.com',
      password: 'password123',
      role: 'client',
      company: {
        name: 'TechFlow India',
        description: 'Leading AI solutions provider in India.',
        website: 'https://techflow.com',
        industry: 'Technology',
        location: {
          city: 'Bengaluru',
          country: 'India'
        }
      },
      subscription: {
        plan: 'premium',
        jobPostingLimit: 50,
        jobPostingsUsed: 2
      }
    });

    console.log('✅ Demo client created');

    // Create a demo user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      professional: {
        title: 'Full Stack Developer',
        experience: 5,
        skills: ['React', 'Node.js', 'MongoDB', 'Python']
      }
    });

    console.log('✅ Demo user created');

    // Create a demo admin
    await User.create({
      name: 'System Admin',
      email: 'admin@talentora.ai',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('✅ Demo admin created');

    // Create many more jobs for pagination testing
    const jobTitles = [
      'Senior AI Engineer', 'Product Designer', 'Frontend Architect', 'Backend Developer',
      'Data Scientist', 'DevOps Specialist', 'Full Stack Engineer', 'UX Researcher',
      'Machine Learning Lead', 'Mobile Dev (React Native)', 'Cloud Architect',
      'Security Analyst', 'Product Manager', 'QA Automation Engineer', 'Technical Architect'
    ];

    const moreJobs = jobTitles.map((title, index) => ({
      client: client._id,
      title,
      description: `Join our team as a ${title}. We are working on cutting-edge AI technologies and looking for talented individuals who want to make an impact.`,
      jobType: index % 3 === 0 ? 'contract' : 'full-time',
      category: index % 2 === 0 ? 'Software Development' : 'Design',
      location: {
        type: index % 4 === 0 ? 'remote' : 'onsite',
        city: index % 3 === 0 ? 'Bengaluru' : (index % 3 === 1 ? 'Mumbai' : 'Pune'),
        country: 'India'
      },
      salary: {
        min: 1200000 + (index * 100000),
        max: 2000000 + (index * 150000),
        currency: 'INR',
        period: 'yearly'
      },
      requirements: {
        experience: { min: 2 + (index % 4) },
        education: 'Bachelor',
        skills: ['React', 'Node.js', 'AI', 'Cloud'].slice(0, 1 + (index % 4))
      },
      applicationDeadline: new Date(Date.now() + (15 + index) * 24 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() + (45 + index) * 24 * 60 * 60 * 1000),
      status: 'active',
      approvalStatus: 'approved',
      isHot: index < 3
    }));

    await Job.insertMany(moreJobs);
    console.log(`✅ ${moreJobs.length} Demo jobs created`);

    console.log('✨ Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
