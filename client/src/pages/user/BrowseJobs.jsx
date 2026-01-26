import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Filter, Clock, Building, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock Data
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior AI Engineer",
    company: "TechFlow",
    logo: "https://ui-avatars.com/api/?name=TF&background=8b5cf6&color=fff",
    location: "San Francisco, CA (Remote)",
    salary: "$180k - $250k",
    type: "Full-time",
    posted: "2 hours ago",
    tags: ["Python", "PyTorch", "LLMs"],
    isHot: true
  },
  {
    id: 2,
    title: "Product Designer",
    company: "InnovateAI",
    logo: "https://ui-avatars.com/api/?name=IA&background=f59e0b&color=fff",
    location: "New York, NY",
    salary: "$130k - $170k",
    type: "Full-time",
    posted: "5 hours ago",
    tags: ["Figma", "UI/UX", "Prototyping"],
    isHot: false
  },
  {
    id: 3,
    title: "Machine Learning Ops",
    company: "DataSphere",
    logo: "https://ui-avatars.com/api/?name=DS&background=10b981&color=fff",
    location: "Remote",
    salary: "$160k - $220k",
    type: "Contract",
    posted: "1 day ago",
    tags: ["AWS", "Docker", "Kubernetes"],
    isHot: false
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "FutureScale",
    logo: "https://ui-avatars.com/api/?name=FS&background=ec4899&color=fff",
    location: "Austin, TX",
    salary: "$120k - $150k",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["React", "TypeScript", "Tailwind"],
    isHot: true
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "NeuralNet",
    logo: "https://ui-avatars.com/api/?name=NN&background=6366f1&color=fff",
    location: "Boston, MA",
    salary: "$150k - $190k",
    type: "Full-time",
    posted: "3 days ago",
    tags: ["R", "SQL", "Statistics"],
    isHot: false
  },
  {
    id: 6,
    title: "AI Ethics Researcher",
    company: "CyberPeak",
    logo: "https://ui-avatars.com/api/?name=CP&background=ef4444&color=fff",
    location: "London, UK (Remote)",
    salary: "$110k - $160k",
    type: "Part-time",
    posted: "Just now",
    tags: ["Research", "Ethics", "Policy"],
    isHot: true
  }
];

const BrowseJobs = () => {
  const containerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(".page-header",
        { y: -30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }
      );

      // Search Bar Animation
      gsap.fromTo(".search-bar-container",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );

      // Job Cards stagger
      gsap.fromTo(".job-card",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".jobs-grid",
            start: "top bottom-=100"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-midnight-900 text-white selection:bg-electric-purple-glow selection:text-white pt-24 pb-20">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-electric-purple/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="container-custom relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10 page-header">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 mb-4">
              <Briefcase className="w-4 h-4 text-gold" />
              <span className="text-sm text-gray-300">Over 1,500+ Active Roles</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
             Find Your <span className="text-electric-purple">Next Mission</span>
           </h1>
           <p className="text-gray-400 max-w-2xl mx-auto">
             Browse AI-matched opportunities from top tech companies.
           </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md mb-12 shadow-lg max-w-5xl mx-auto search-bar-container">
           <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-electric-purple transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Job title, keywords, or company..."
                   className="w-full bg-midnight-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-electric-purple/50 focus:ring-1 focus:ring-electric-purple/50 transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex-1 relative group">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-electric-purple transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Location or 'Remote'"
                   className="w-full bg-midnight-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-electric-purple/50 focus:ring-1 focus:ring-electric-purple/50 transition-all"
                   value={locationTerm}
                   onChange={(e) => setLocationTerm(e.target.value)}
                 />
              </div>
              <button className="bg-electric-purple hover:bg-electric-purple-light text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-electric-purple/25 flex items-center justify-center gap-2 min-w-[120px]">
                 Search
              </button>
           </div>
           
           {/* Quick Filters */}
           <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
              <span className="text-sm font-medium text-gray-400 mr-2 flex items-center gap-1"><Filter className="w-3 h-3" /> Filters:</span>
              {['Full-time', 'Contract', 'Remote', 'Engineering', 'Design', '$150k+'].map((filter, i) => (
                 <button key={i} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300">
                    {filter}
                 </button>
              ))}
           </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
           {MOCK_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
           ))}
        </div>

        <div className="mt-12 text-center">
           <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all group">
              Load More Opportunities <ChevronDown className="w-4 h-4 inline-block ml-1 group-hover:translate-y-1 transition-transform" />
           </button>
        </div>

      </div>
    </div>
  );
};

const JobCard = ({ job }) => (
  <Link 
    to={`/jobs/${job.id}`}
    className="job-card block group relative bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-electric-purple/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
     {job.isHot && (
        <div className="absolute top-4 right-4">
           <div className="flex items-center gap-1 px-2 py-1 rounded bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Hot
           </div>
        </div>
     )}

     <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-midnight-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
           <img src={job.logo} alt={job.company} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
           <h3 className="text-xl font-bold text-white group-hover:text-electric-purple transition-colors mb-1">{job.title}</h3>
           <div className="text-gray-400 font-medium flex items-center gap-2 text-sm">
              <Building className="w-3 h-3" /> {job.company}
           </div>
        </div>
     </div>

     <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-300">
        <div className="flex items-center gap-1.5 bg-midnight-900/50 px-3 py-1.5 rounded-lg border border-white/5">
           <MapPin className="w-3.5 h-3.5 text-gray-500" /> {job.location}
        </div>
        <div className="flex items-center gap-1.5 bg-midnight-900/50 px-3 py-1.5 rounded-lg border border-white/5">
           <DollarSign className="w-3.5 h-3.5 text-gray-500" /> {job.salary}
        </div>
        <div className="flex items-center gap-1.5 bg-midnight-900/50 px-3 py-1.5 rounded-lg border border-white/5">
           <Briefcase className="w-3.5 h-3.5 text-gray-500" /> {job.type}
        </div>
     </div>

     <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2">
           {job.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-electric-purple/10 text-electric-purple-light border border-electric-purple/20">
                 {tag}
              </span>
           ))}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
           <Clock className="w-3 h-3" /> {job.posted}
        </div>
     </div>
  </Link>
);

export default BrowseJobs;
