import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../../redux/slices/jobSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MatchScore from '../../components/features/MatchScore';
import { 
  MapPin, Briefcase, IndianRupee, Clock, Building2, Calendar, CheckCircle, 
  Users, Award, TrendingUp, Heart, Share2, Bookmark, Globe, Linkedin, 
  Twitter, Mail, Phone, Video, FileText, Target, Zap, Gift, Coffee, 
  Laptop, GraduationCap, Plane, Shield
} from 'lucide-react';
import { formatSalary, getRelativeTime, formatDate } from '../../utils/helpers';
import { calculateJobMatch } from '../../redux/slices/aiSlice';
import { getMockJobById } from '../../data/mockJobs';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, loading: jobLoading, error } = useSelector((state) => state.job);
  const { matchScore, loading: matchLoading } = useSelector((state) => state.ai);
  
  // Try to get mock data only as an ultra-fallback or if id is small (mock)
  const [displayJob, setDisplayJob] = useState(() => (id?.length < 10 ? getMockJobById(id) : null));

  // Defined benefits and perks for display
  const benefits = [
    { icon: Shield, title: "Health Insurance", description: "Comprehensive medical, dental, and vision coverage" },
    { icon: Laptop, title: "Work From Home", description: "Flexible remote work options" },
    { icon: GraduationCap, title: "Learning Budget", description: "₹50,000 annual learning allowance" },
    { icon: Plane, title: "Paid Time Off", description: "25 days PTO + public holidays" },
  ];

  const perks = ["Free Gym Membership", "Weekly Team Lunch", "Pet Friendly Office", "Personal Growth Plan"];

  useEffect(() => {
    if (id && id.length >= 24) {
      dispatch(getJobById(id));
      dispatch(calculateJobMatch(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob && !error) {
      setDisplayJob(currentJob);
    }
  }, [currentJob, error]);

  if (jobLoading && !displayJob) return <Loader fullScreen />;
  
  if (!displayJob && error) {
    return (
      <div className="container-custom py-24 text-center">
        <h2 className="text-2xl font-bold text-red-500">Job Not Found</h2>
        <p className="text-gray-400 mt-2">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs">
          <Button variant="secondary" className="mt-6">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  const { 
    title, 
    description, 
    requirements, 
    salary, 
    location, 
    jobType, 
    client, 
    createdAt, 
    applicants,
    responsibilities: respsEnv,
    benefits: benefitsEnv
  } = displayJob || {};

  const companyName = client?.company?.name || client?.name || 'TechFlow India';
  const displayLocation = location?.city ? `${location.city}, ${location.country || 'India'}` : (typeof location === 'string' ? location : 'Remote');
  const displaySalary = salary?.min ? formatSalary(salary.min, salary.max) : (typeof salary === 'string' ? salary : 'Negotiable');
  const displayType = jobType || 'Full-time';
  const displayLogo = `https://ui-avatars.com/api/?name=${companyName.substring(0,2)}&background=8b5cf6&color=fff`;
  const applicantCount = applicants?.length || displayJob?.stats?.applications || 0;

  const interviewProcess = [
    { step: 1, title: "Application Review", duration: "2-3 days", description: "Our team reviews your application and resume" },
    { step: 2, title: "Technical Assessment", duration: "1-2 hours", description: "Coding challenge or technical task" },
    { step: 3, title: "Final Round", duration: "45 mins", description: "Discussion with hiring manager" }
  ];

  const similarJobs = [
    { id: '2', title: "Product Designer", company: "InnovateBharat", salary: "₹18L - ₹28L", location: "Mumbai" },
    { id: '4', title: "Frontend Developer", company: "FutureScale", salary: "₹12L - ₹20L", location: "Pune" },
  ];

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-electric-purple/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/jobs" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-2 transition-colors">
            ← Back to Jobs
          </Link>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Job Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-purple to-electric-purple-light flex items-center justify-center text-4xl font-bold text-white border border-white/20 shadow-lg shrink-0 overflow-hidden">
                    <img src={displayLogo} alt={companyName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold font-display text-white mb-2">{title}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-400">
                      <span className="flex items-center gap-1.5"><Building2 size={16} /> {companyName}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={16} /> {displayLocation}</span>
                      <span className="flex items-center gap-1.5"><Clock size={16} /> Posted {getRelativeTime(createdAt) || 'Recent'}</span>
                      <span className="flex items-center gap-1.5"><Users size={16} /> {applicantCount} applicants</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-2 rounded-full bg-electric-purple/10 text-electric-purple border border-electric-purple/20 text-sm font-medium flex items-center gap-2">
                    <Briefcase size={14} /> {displayType}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium flex items-center gap-2">
                    <IndianRupee size={14} /> {displaySalary}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium flex items-center gap-2">
                    <Calendar size={14} /> Actively Hiring
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="flex-1 min-w-[200px]" 
                    size="lg"
                    onClick={() => navigate(`/user/jobs/${id}/apply`)}
                  >
                    Apply Now
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Bookmark size={16} /> Save
                  </Button>
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Share2 size={16} /> Share
                  </Button>
                </div>
              </div>

              {/* Right: Match Score */}
              <div className="w-full lg:w-80">
                <MatchScore 
                  score={matchScore?.overallScore || 0} 
                  breakdown={matchScore?.breakdown} 
                  isLoading={matchLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About the Job */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="text-electric-purple" size={24} />
                About the Job
              </h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {description || `We are seeking a talented Senior AI Engineer to join our innovative team. You'll work on cutting-edge AI/ML projects, developing and deploying large language models and neural networks that power our products.

In this role, you'll collaborate with cross-functional teams to design, implement, and optimize AI solutions that directly impact millions of users. You'll have the opportunity to work with the latest technologies and contribute to groundbreaking research.`}
              </div>
            </Card>

            {/* Requirements */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="text-electric-purple" size={24} />
                Requirements
              </h2>
              <div className="space-y-3">
                {(requirements?.skills || ['Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Deep Learning', 'MLOps']).map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-electric-purple flex-shrink-0" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-bold text-white mb-3">Experience & Education</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• 5+ years of experience in AI/ML engineering</p>
                  <p>• Master's or PhD in Computer Science, AI, or related field preferred</p>
                  <p>• Strong publication record in top-tier conferences (bonus)</p>
                </div>
              </div>
            </Card>

            {/* Responsibilities */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-electric-purple" size={24} />
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {[
                  "Design and implement state-of-the-art AI/ML models and algorithms",
                  "Collaborate with product teams to integrate AI capabilities into products",
                  "Optimize model performance, scalability, and efficiency",
                  "Conduct research and stay updated with latest AI advancements",
                  "Mentor junior engineers and contribute to technical documentation",
                  "Participate in code reviews and maintain high code quality standards"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-electric-purple mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits & Perks */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Gift className="text-electric-purple" size={24} />
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-electric-purple/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon size={20} className="text-electric-purple" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h3 className="font-bold text-white mb-3">Additional Perks</h3>
                <div className="flex flex-wrap gap-2">
                  {perks.map((perk, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Interview Process */}
            <Card>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Video className="text-electric-purple" size={24} />
                Interview Process
              </h2>
              <div className="space-y-4">
                {interviewProcess.map((stage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-electric-purple/10 border-2 border-electric-purple flex items-center justify-center font-bold text-electric-purple">
                        {stage.step}
                      </div>
                      {index < interviewProcess.length - 1 && (
                        <div className="w-0.5 h-full bg-white/10 my-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white">{stage.title}</h3>
                        <span className="text-sm text-gray-500">{stage.duration}</span>
                      </div>
                      <p className="text-sm text-gray-400">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> The entire process typically takes 2-3 weeks. We'll keep you updated at every stage!
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Overview */}
            <Card>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Building2 className="text-electric-purple" size={20} />
                Company Overview
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {client?.company?.description || "We are a leading technology company focused on innovation and digital transformation. Our mission is to build AI-powered solutions that make a real difference in people's lives."}
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry</span>
                  <span className="text-gray-300">{client?.company?.industry || 'Technology'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Company Size</span>
                  <span className="text-gray-300">500-1000 employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Founded</span>
                  <span className="text-gray-300">2015</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Funding</span>
                  <span className="text-gray-300">Series C</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10">
                <a href={client?.company?.website || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-electric-purple hover:underline text-sm mb-2">
                  <Globe size={14} /> Visit Website
                </a>
                <div className="flex gap-3 mt-3">
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Linkedin size={16} className="text-gray-400" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Twitter size={16} className="text-gray-400" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Mail size={16} className="text-gray-400" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Job Stats */}
            <Card>
              <h3 className="font-bold text-lg mb-4">Job Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Applications</span>
                    <span className="text-white font-medium">{applicants?.length || 47}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-electric-purple h-2 rounded-full" style={{ width: '47%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Views</span>
                    <span className="text-white font-medium">1,234</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    This job is in the top <span className="text-electric-purple font-bold">10%</span> of most viewed positions
                  </p>
                </div>
              </div>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <h3 className="font-bold text-lg mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {similarJobs.map((job) => (
                  <Link 
                    key={job.id} 
                    to={`/jobs/${job.id}`}
                    className="block p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
                  >
                    <h4 className="font-medium text-white text-sm mb-1">{job.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{job.company}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{job.location}</span>
                      <span className="text-green-400 font-medium">{job.salary}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Posted By / Contact Recruiter */}
            <Card className="bg-gradient-to-br from-electric-purple/10 to-gold/10 border-electric-purple/20">
              <h3 className="font-bold text-lg mb-4">Posted By</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={client?.avatar || `https://ui-avatars.com/api/?name=${client?.name || 'Recruiter'}&background=random&color=fff`} 
                  alt={client?.name} 
                  className="w-12 h-12 rounded-full border-2 border-electric-purple/30"
                />
                <div>
                  <h4 className="font-bold text-white leading-tight">{client?.name || 'Recruiting Team'}</h4>
                  <p className="text-sm text-gray-400">{client?.role || 'HR Department'}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-electric-purple">
                    <CheckCircle size={16} />
                  </div>
                  <span>Responsive Employer</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold">
                    <Award size={16} />
                  </div>
                  <span>Top Rated Recruiter</span>
                </div>
              </div>

              <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Mail size={16} /> Contact {client?.name?.split(' ')[0] || 'Recruiter'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
