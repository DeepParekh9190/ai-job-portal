import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Briefcase, IndianRupee, Filter, Clock, Building, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mock Data - Expanded Job Listings
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior AI Engineer",
    company: "TechFlow India",
    logo: "https://ui-avatars.com/api/?name=TF&background=8b5cf6&color=fff",
    location: "Bengaluru, KA (Remote)",
    salary: "₹25L - ₹45L",
    type: "Full-time",
    posted: "2 hours ago",
    tags: ["Python", "PyTorch", "LLMs"],
    isHot: true
  },
  {
    id: 2,
    title: "Product Designer",
    company: "InnovateBharat",
    logo: "https://ui-avatars.com/api/?name=IB&background=f59e0b&color=fff",
    location: "Mumbai, MH",
    salary: "₹18L - ₹28L",
    type: "Full-time",
    posted: "5 hours ago",
    tags: ["Figma", "UI/UX", "Prototyping"],
    isHot: false
  },
  {
    id: 3,
    title: "Machine Learning Ops Engineer",
    company: "DataSphere",
    logo: "https://ui-avatars.com/api/?name=DS&background=10b981&color=fff",
    location: "Remote",
    salary: "₹22L - ₹35L",
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
    location: "Pune, MH",
    salary: "₹12L - ₹20L",
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
    location: "Hyderabad, TG",
    salary: "₹20L - ₹32L",
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
    location: "Gurgaon, HR (Remote)",
    salary: "₹15L - ₹25L",
    type: "Part-time",
    posted: "Just now",
    tags: ["Research", "Ethics", "Policy"],
    isHot: true
  },
  {
    id: 7,
    title: "Full Stack Developer",
    company: "CloudNine Technologies",
    logo: "https://ui-avatars.com/api/?name=CN&background=3b82f6&color=fff",
    location: "Bengaluru, KA",
    salary: "₹15L - ₹25L",
    type: "Full-time",
    posted: "6 hours ago",
    tags: ["Node.js", "React", "MongoDB"],
    isHot: false
  },
  {
    id: 8,
    title: "DevOps Engineer",
    company: "ScaleOps",
    logo: "https://ui-avatars.com/api/?name=SO&background=14b8a6&color=fff",
    location: "Remote",
    salary: "₹18L - ₹30L",
    type: "Full-time",
    posted: "8 hours ago",
    tags: ["Jenkins", "Terraform", "CI/CD"],
    isHot: true
  },
  {
    id: 9,
    title: "Mobile App Developer (iOS)",
    company: "AppCraft Studios",
    logo: "https://ui-avatars.com/api/?name=AC&background=a855f7&color=fff",
    location: "Chennai, TN",
    salary: "₹14L - ₹22L",
    type: "Full-time",
    posted: "12 hours ago",
    tags: ["Swift", "SwiftUI", "iOS"],
    isHot: false
  },
  {
    id: 10,
    title: "Blockchain Developer",
    company: "CryptoVerse",
    logo: "https://ui-avatars.com/api/?name=CV&background=f97316&color=fff",
    location: "Mumbai, MH (Hybrid)",
    salary: "₹20L - ₹35L",
    type: "Full-time",
    posted: "1 day ago",
    tags: ["Solidity", "Web3", "Ethereum"],
    isHot: true
  },
  {
    id: 11,
    title: "UX Researcher",
    company: "UserFirst Design",
    logo: "https://ui-avatars.com/api/?name=UF&background=ec4899&color=fff",
    location: "Pune, MH",
    salary: "₹12L - ₹18L",
    type: "Full-time",
    posted: "1 day ago",
    tags: ["User Testing", "Analytics", "Research"],
    isHot: false
  },
  {
    id: 12,
    title: "Cloud Architect",
    company: "SkyTech Solutions",
    logo: "https://ui-avatars.com/api/?name=ST&background=06b6d4&color=fff",
    location: "Bengaluru, KA",
    salary: "₹30L - ₹50L",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["Azure", "AWS", "GCP"],
    isHot: true
  },
  {
    id: 13,
    title: "Backend Engineer (Python)",
    company: "DataFlow Inc",
    logo: "https://ui-avatars.com/api/?name=DF&background=84cc16&color=fff",
    location: "Remote",
    salary: "₹16L - ₹28L",
    type: "Full-time",
    posted: "2 days ago",
    tags: ["Python", "Django", "PostgreSQL"],
    isHot: false
  },
  {
    id: 14,
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    logo: "https://ui-avatars.com/api/?name=SN&background=dc2626&color=fff",
    location: "Delhi, DL",
    salary: "₹18L - ₹32L",
    type: "Full-time",
    posted: "3 days ago",
    tags: ["Penetration Testing", "SIEM", "Security"],
    isHot: false
  },
  {
    id: 15,
    title: "QA Automation Engineer",
    company: "TestPro Labs",
    logo: "https://ui-avatars.com/api/?name=TP&background=eab308&color=fff",
    location: "Hyderabad, TG",
    salary: "₹10L - ₹18L",
    type: "Full-time",
    posted: "3 days ago",
    tags: ["Selenium", "Cypress", "Testing"],
    isHot: false
  },
  {
    id: 16,
    title: "Technical Writer",
    company: "DocuTech",
    logo: "https://ui-avatars.com/api/?name=DT&background=8b5cf6&color=fff",
    location: "Remote",
    salary: "₹8L - ₹15L",
    type: "Full-time",
    posted: "4 days ago",
    tags: ["Documentation", "API Docs", "Writing"],
    isHot: false
  },
  {
    id: 17,
    title: "Computer Vision Engineer",
    company: "VisionAI",
    logo: "https://ui-avatars.com/api/?name=VA&background=6366f1&color=fff",
    location: "Bengaluru, KA (Hybrid)",
    salary: "₹22L - ₹40L",
    type: "Full-time",
    posted: "4 days ago",
    tags: ["OpenCV", "TensorFlow", "Deep Learning"],
    isHot: true
  },
  {
    id: 18,
    title: "Product Manager",
    company: "ProductHub",
    logo: "https://ui-avatars.com/api/?name=PH&background=f59e0b&color=fff",
    location: "Mumbai, MH",
    salary: "₹25L - ₹45L",
    type: "Full-time",
    posted: "5 days ago",
    tags: ["Product Strategy", "Roadmap", "Agile"],
    isHot: false
  },
  {
    id: 19,
    title: "Game Developer (Unity)",
    company: "PlayForge Studios",
    logo: "https://ui-avatars.com/api/?name=PF&background=a855f7&color=fff",
    location: "Pune, MH",
    salary: "₹12L - ₹22L",
    type: "Full-time",
    posted: "5 days ago",
    tags: ["Unity", "C#", "Game Design"],
    isHot: false
  },
  {
    id: 20,
    title: "Data Engineer",
    company: "BigData Corp",
    logo: "https://ui-avatars.com/api/?name=BD&background=10b981&color=fff",
    location: "Bengaluru, KA",
    salary: "₹18L - ₹30L",
    type: "Full-time",
    posted: "6 days ago",
    tags: ["Spark", "Hadoop", "ETL"],
    isHot: false
  },
  {
    id: 21,
    title: "NLP Engineer",
    company: "LanguageTech",
    logo: "https://ui-avatars.com/api/?name=LT&background=3b82f6&color=fff",
    location: "Remote",
    salary: "₹20L - ₹38L",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["NLP", "Transformers", "BERT"],
    isHot: true
  },
  {
    id: 22,
    title: "Android Developer",
    company: "MobileFirst",
    logo: "https://ui-avatars.com/api/?name=MF&background=84cc16&color=fff",
    location: "Hyderabad, TG",
    salary: "₹13L - ₹21L",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["Kotlin", "Jetpack Compose", "Android"],
    isHot: false
  },
  {
    id: 23,
    title: "Site Reliability Engineer",
    company: "ReliableOps",
    logo: "https://ui-avatars.com/api/?name=RO&background=14b8a6&color=fff",
    location: "Bengaluru, KA",
    salary: "₹22L - ₹38L",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["SRE", "Monitoring", "Incident Response"],
    isHot: false
  },
  {
    id: 24,
    title: "AI Research Scientist",
    company: "DeepMind India",
    logo: "https://ui-avatars.com/api/?name=DM&background=8b5cf6&color=fff",
    location: "Bengaluru, KA",
    salary: "₹35L - ₹60L",
    type: "Full-time",
    posted: "1 week ago",
    tags: ["Research", "ML", "Publications"],
    isHot: true
  }
];

const BrowseJobs = () => {
  const containerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(8);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize and update displayed jobs
  useEffect(() => {
    // Filter logic here (if search/filter is active, ignore pagination or handle it differently)
    // For now, simpler implementation:
    const filtered = MOCK_JOBS.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationTerm.toLowerCase());
      return matchesSearch && matchesLocation;
    });

    if (searchTerm || locationTerm) {
      setDisplayedJobs(filtered);
    } else {
      // If we need more jobs than we have mock data for, generate them
      if (displayCount > MOCK_JOBS.length) {
         const extraCount = displayCount - MOCK_JOBS.length;
         const extraJobs = Array.from({ length: extraCount }).map((_, i) => ({
            ...MOCK_JOBS[i % MOCK_JOBS.length],
            id: MOCK_JOBS.length + i + 1,
            title: MOCK_JOBS[i % MOCK_JOBS.length].title, // Keep original professional title
            posted: "Just now"
         }));
         setDisplayedJobs([...MOCK_JOBS, ...extraJobs]);
      } else {
         setDisplayedJobs(filtered.slice(0, displayCount));
      }
    }
  }, [searchTerm, locationTerm, displayCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate network delay for effect
    setTimeout(() => {
      setDisplayCount(prev => prev + 6);
      setIsLoadingMore(false);
      
      // Refresh animations for new items
      // We need a slight delay to let React render the new nodes
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 800);
  };

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
              <span className="text-sm text-gray-300">24+ Active Roles Across India</span>
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
              {['Full-time', 'Contract', 'Remote', 'Engineering', 'Design', '₹15L+'].map((filter, i) => (
                 <button key={i} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-gray-300">
                    {filter}
                 </button>
              ))}
           </div>
        </div>

        {/* Jobs Grid */}
        <div className="jobs-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
           {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
           ))}
        </div>

        {/* Load More Button */}
        {!searchTerm && !locationTerm && (
          <div className="mt-12 text-center">
             <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Loading...
                  </span>
                ) : (
                  <>Load More Opportunities <ChevronDown className="w-4 h-4 inline-block ml-1 group-hover:translate-y-1 transition-transform" /></>
                )}
             </button>
          </div>
        )}

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
           <IndianRupee className="w-3.5 h-3.5 text-gray-500" /> {job.salary}
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
