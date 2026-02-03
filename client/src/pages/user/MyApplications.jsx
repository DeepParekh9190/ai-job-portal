import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications, withdrawApplication } from '../../redux/slices/applicationSlice';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock4,
  Zap
} from 'lucide-react';
import gsap from 'gsap';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, stats } = useSelector((state) => state.application);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const containerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && applications.length > 0) {
      gsap.fromTo(".application-card", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [loading, applications]);

  const handleWithdraw = (id) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      dispatch(withdrawApplication(id));
    }
  };

  const statusMap = {
    pending: { label: 'Pending', icon: <Clock4 size={14} />, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    'under-review': { label: 'In Review', icon: <AlertCircle size={14} />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    interviewing: { label: 'Interviewing', icon: <Zap size={14} />, color: 'text-electric-purple', bg: 'bg-electric-purple/10', border: 'border-electric-purple/20' },
    accepted: { label: 'Accepted', icon: <CheckCircle2 size={14} />, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    rejected: { label: 'Rejected', icon: <XCircle size={14} />, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    withdrawn: { label: 'Withdrawn', icon: <Trash2 size={14} />, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' },
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.job?.client?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 overflow-hidden" ref={containerRef}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric-purple/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold/5 rounded-full blur-[100px] -z-10"></div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold font-display mb-3">My <span className="text-gold">Applications</span></h1>
            <p className="text-gray-400 max-w-xl">
              Track your career journey. Monitor status updates, manage interviews, and land your next big role with AI-powered tracking.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 backdrop-blur-xl">
                <div className="text-center border-r border-white/10 pr-4">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider mb-1">Total</p>
                  <p className="text-xl font-bold text-white">{applications.length}</p>
                </div>
                <div className="text-center border-r border-white/10 pr-4 pl-4">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider mb-1 text-gold">Pending</p>
                  <p className="text-xl font-bold text-gold">{applications.filter(a => a.status === 'pending').length}</p>
                </div>
                <div className="text-center pl-4">
                  <p className="text-gray-500 uppercase text-[10px] tracking-wider mb-1 text-green-400">Offers</p>
                  <p className="text-xl font-bold text-green-400">{applications.filter(a => a.status === 'accepted').length}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-electric-purple transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by job title or company..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={18} />
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-gold transition-all outline-none appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
              <Clock size={18} className="text-gray-400" />
              <span>Recent</span>
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4" ref={listRef}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-electric-purple/20 border-t-electric-purple rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium">Fetching Applications...</p>
            </div>
          ) : filteredApps.length > 0 ? (
            filteredApps.map((app) => {
              const status = statusMap[app.status] || statusMap.pending;
              return (
                <div 
                  key={app._id} 
                  className="application-card group bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/[0.07] backdrop-blur-md relative overflow-hidden"
                >
                  {/* Glass highlight effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-all"></div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-midnight-800 to-midnight-700 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                        {app.job?.client?.company?.logo ? (
                          <img src={app.job.client.company.logo} alt="" className="w-10 h-10 object-contain" />
                        ) : (
                          <Briefcase className="text-electric-purple" size={28} />
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <Link to={`/jobs/${app.job?._id}`} className="text-xl font-bold text-white hover:text-electric-purple transition-colors flex items-center gap-2">
                          {app.job?.title}
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                          <span className="font-medium text-gray-300">{app.job?.client?.company?.name}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-600" /> {app.job?.location?.city || 'Remote'}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-600" /> Applied {formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 lg:gap-8 w-full lg:w-auto">
                      {/* AI Score (Mocked context) */}
                      <div className="px-4 py-2 bg-electric-purple/10 border border-electric-purple/20 rounded-xl flex items-center gap-2">
                        <Zap size={14} className="text-electric-purple fill-electric-purple" />
                        <span className="text-sm font-bold text-electric-purple">Match 85%</span>
                      </div>

                      <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${status.bg} ${status.color} ${status.border} font-bold text-sm min-w-[120px] justify-center`}>
                        {status.icon}
                        {status.label}
                      </div>

                      <div className="flex items-center gap-2 ml-auto lg:ml-0">
                         <Link to={`/user/applications/${app._id}`} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 hover:border-white/10">
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                         </Link>
                         {app.status === 'pending' && (
                           <button 
                             onClick={() => handleWithdraw(app._id)}
                             className="p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/10 hover:border-red-500/20"
                             title="Withdraw Application"
                           >
                             <Trash2 size={20} className="text-red-400" />
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No applications found</h3>
              <p className="text-gray-500 max-w-sm mb-8">
                {searchTerm || filterStatus !== 'all' 
                  ? "We couldn't find any applications matching your current filters."
                  : "You haven't applied to any roles yet. Start browsing jobs to find your next opportunity."}
              </p>
              <Link 
                to="/jobs" 
                className="px-8 py-4 bg-gradient-to-r from-electric-purple to-indigo-600 rounded-full font-bold hover:shadow-lg hover:shadow-electric-purple/20 transition-all active:scale-95"
              >
                Explore All Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
