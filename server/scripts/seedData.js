import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Client from '../models/Client.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-job-portal';

// Indian Names Data
const maleFirstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharva', 'Aaryan', 'Dhruv', 'Kabir', 'Ritik', 'Rohan', 'Rahul', 'Amit', 'Sumit', 'Manish', 'Vikas', 'Prakash', 'Sanjay', 'Raj', 'Siddharth', 'Kunal', 'Rohit', 'Vikram', 'Ravi', 'Anil', 'Nitin', 'Abhishek', 'Manoj', 'Deepak', 'Suresh', 'Ramesh', 'Gaurav', 'Tarun', 'Pratik', 'Harsh', 'Mohit', 'Jay', 'Karthik', 'Nikhil', 'Praveen', 'Sandeep', 'Naveen', 'Ashwin', 'Tarun', 'Dev', 'Om', 'Arnav', 'Rishi', 'Karan'];
const femaleFirstNames = ['Ananya', 'Aadya', 'Diya', 'Pihu', 'Prisha', 'Anika', 'Sneha', 'Neha', 'Riya', 'Anjali', 'Pooja', 'Priya', 'Aarti', 'Divya', 'Kavya', 'Isha', 'Nidhi', 'Shreya', 'Ruchi', 'Kiran', 'Swati', 'Preeti', 'Jyoti', 'Megha', 'Payal', 'Nisha', 'Pallavi', 'Sonam', 'Priyanka', 'Deepa', 'Smriti', 'Kirti', 'Meera', 'Rani', 'Gauri', 'Trisha', 'Kiara', 'Myra', 'Ira', 'Tara', 'Roshni', 'Rishika', 'Simran', 'Tanvi', 'Ananya', 'Shikha', 'Aarohi', 'Akriti', 'Tanushree', 'Vani', 'Yashi', 'Ojasvi', 'Jhanvi', 'Kritika'];
const lastNames = ['Sharma', 'Singh', 'Kumar', 'Patel', 'Gupta', 'Verma', 'Reddy', 'Nair', 'Menon', 'Yadav', 'Joshi', 'Pandey', 'Das', 'Ray', 'Mishra', 'Bhat', 'Kapoor', 'Malhotra', 'Deshmukh', 'Kulkarni', 'Chauhan', 'Thakur', 'Bose', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Sengupta', 'Pillai', 'Iyer', 'Menon', 'Rao', 'Shetty', 'Vyas', 'Garg', 'Agarwal', 'Bansal', 'Goyal', 'Dubey', 'Tiwari', 'Shukla', 'Awasthi', 'Dixit', 'Chaudhary', 'Gowda', 'Nadar', 'Naidu', 'Rathore', 'Sinha', 'Srivastava', 'Trivedi', 'Upadhyay', 'Varma', 'Yadav', 'Gokhale', 'Jadhav', 'Kadam'];

const topCompaniesList = ['Infosys', 'TCS', 'Wipro', 'Reliance Industries', 'Tata Motors', 'HDFC Bank', 'ICICI Bank', 'L&T', 'Mahindra & Mahindra', 'Bharti Airtel', 'HCL Technologies', 'Tech Mahindra', 'Bajaj Auto', 'Sun Pharma', 'Adani Enterprises', 'ITC Limited', 'State Bank of India', 'Asian Paints', 'Kotak Mahindra Bank', 'Axis Bank', 'Maruti Suzuki', 'Hindustan Unilever', 'JSW Steel', 'Titan Company', 'Mindtree', 'Mphasis', 'Tata Steel', 'NTPC', 'Power Grid', 'Zomato', 'Swiggy', 'Paytm', 'Ola'];

const standardCompaniesPart1 = ['Bharat', 'Hind', 'Indian', 'Vindhya', 'Ganga', 'Arya', 'Shiva', 'Kisan', 'Mega', 'Surya', 'Chakra', 'Anant', 'Veda', 'Nava', 'Amrit', 'Tech', 'Innova', 'Agile', 'Smart', 'NextGen', 'Vision', 'Om', 'Saraswati', 'Ganesha', 'Navarachana', 'Aavishkar', 'Pragati'];
const standardCompaniesPart2 = ['Technologies', 'Solutions', 'Systems', 'Consulting', 'Infosystems', 'Ventures', 'Enterprises', 'Industries', 'Soft', 'Data', 'Network', 'Analytics', 'Labs', 'Digital', 'Capital', 'Finance', 'Logistics', 'Foods', 'Exports', 'Designs', 'Builds', 'Health', 'Pharma', 'Power', 'Energy', 'Automobiles', 'Aero'];

const getRandomName = () => {
    const isMale = Math.random() > 0.5;
    const firstName = isMale 
        ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)] 
        : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return { name: `${firstName} ${lastName}`, gender: isMale ? 'male' : 'female' };
};

const getRandomStandardCompany = () => {
    const p1 = standardCompaniesPart1[Math.floor(Math.random() * standardCompaniesPart1.length)];
    const p2 = standardCompaniesPart2[Math.floor(Math.random() * standardCompaniesPart2.length)];
    return `${p1} ${p2} Pvt Ltd`;
};

const getAvatarUrl = (name, gender) => {
    const seed = name.replace(/\s+/g, '').toLowerCase();
    const style = gender === 'male' ? 'adventurer' : 'adventurer-neutral';
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
}

const getCompanyLogo = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200&bold=true`;
}

const getTopCompanyLogo = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2E1065&color=FBBF24&size=200&bold=true&rounded=true`;
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
        
        console.log('🧹 Wiping all non-admin generated accounts from the database...');
        // Delete all users whose email ends with @example.com to clean up old dummy data safely
        await User.deleteMany({ email: /@example\.com/ });
        await Client.deleteMany({ email: /@example\.com/ });
        console.log('🧹 Complete wipe successful.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        // --- 200 Candidates ---
        console.log('🇮🇳 Spawning 200 Indian Job Candidates...');
        const candidatesToInsert = [];
        for (let i = 0; i < 200; i++) {
           const person = getRandomName();
           candidatesToInsert.push({
               name: person.name,
               email: `${person.name.replace(/\s+/g, '.').toLowerCase()}_${i}@example.com`,
               password: hashedPassword,
               role: 'user',
               profile: { 
                 gender: person.gender,
                 avatar: getAvatarUrl(person.name, person.gender),
                 location: { city: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat'][Math.floor(Math.random() * 10)] }
               },
               preferences: { jobTypes: ['full-time', 'part-time'] },
               isActive: true,
               isEmailVerified: true
           });
        }
        await User.insertMany(candidatesToInsert);
        console.log('✅ 200 Indian Candidates Added');

        // --- 50 Freelancers ---
        console.log('🇮🇳 Spawning 50 Indian Freelancers...');
        const freelancersToInsert = [];
        for (let i = 0; i < 50; i++) {
           const person = getRandomName();
           freelancersToInsert.push({
               name: person.name,
               email: `${person.name.replace(/\s+/g, '.').toLowerCase()}_fl_${i}@example.com`,
               password: hashedPassword,
               role: 'user',
               profile: { 
                 gender: person.gender,
                 avatar: getAvatarUrl(person.name, person.gender),
                 location: { city: ['Pune', 'Noida', 'Gurugram', 'Bengaluru', 'Indore'][Math.floor(Math.random() * 5)] }
               },
               preferences: { jobTypes: ['freelance', 'contract'] },
               isActive: true,
               isEmailVerified: true
           });
        }
        await User.insertMany(freelancersToInsert);
        console.log('✅ 50 Indian Freelancers Added');

        // --- 100 Employers ---
        console.log('🏢 Spawning 100 Indian Corporate Employers...');
        const employersToInsert = [];
        for (let i = 0; i < 100; i++) {
           const person = getRandomName();
           const companyName = getRandomStandardCompany();
           employersToInsert.push({
               name: person.name,
               email: `${person.name.replace(/\s+/g, '.').toLowerCase()}_hr_${i}@example.com`,
               password: hashedPassword,
               role: 'client',
               company: { 
                 name: companyName, 
                 size: ['1-10', '11-50', '51-200', '201-500', '501-1000'][Math.floor(Math.random() * 5)], 
                 industry: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Marketing', 'Consulting', 'Manufacturing'][Math.floor(Math.random() * 8)],
                 logo: getCompanyLogo(companyName),
                 location: { city: ['Navi Mumbai', 'Thane', 'Gurgaon', 'Kochi', 'Coimbatore'][Math.floor(Math.random() * 5)] }
               },
               contactPerson: {
                 name: person.name,
                 email: `${person.name.replace(/\s+/g, '.').toLowerCase()}@company${i}.example.com`
               },
               verificationStatus: 'pending',
               isVerified: false,
               isActive: true,
               isEmailVerified: true
           });
        }
        await Client.insertMany(employersToInsert);
        console.log('✅ 100 Indian Employers Added (Needs Verification)');

        // --- 25 Top Companies ---
        console.log('🚀 Spawning 25 Top Indian Blue Chip Titans...');
        const topCompaniesToInsert = [];
        const shuffledTopCompanies = topCompaniesList.sort(() => 0.5 - Math.random()).slice(0, 25);
        for (let i = 0; i < 25; i++) {
           const person = getRandomName();
           const companyName = shuffledTopCompanies[i];
           topCompaniesToInsert.push({
               name: person.name,
               email: `executive_${i}@${companyName.replace(/\s+|,|&/g, '').toLowerCase()}.example.com`,
               password: hashedPassword,
               role: 'client',
               company: { 
                 name: companyName, 
                 size: '1000+', 
                 industry: 'Technology', 
                 logo: getTopCompanyLogo(companyName),
                 location: { city: ['Mumbai', 'Bengaluru', 'Delhi NCR', 'Hyderabad'][Math.floor(Math.random() * 4)] }
               },
               verificationStatus: 'approved',
               isVerified: true,
               stats: { totalHires: Math.floor(Math.random() * 1000) + 100 },
               subscription: { plan: 'enterprise' },
               isActive: true,
               isEmailVerified: true
           });
        }
        await Client.insertMany(topCompaniesToInsert);
        console.log('✅ 25 Top Indian Titans Added (Pre-Verified & Enterprise)');

        console.log('🎉 Database Refresh Complete! Check your Dashboard!');
        process.exit();
    } catch (error) {
        console.error('Error with database seeding', error);
        process.exit(1);
    }
};

seedDatabase();
