import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalytics } from '../../redux/slices/adminSlice';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Zap, 
  Users, 
  Building2, 
  Layers
} from 'lucide-react';
import Loader from '../../components/common/Loader';

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  if (loading && !analytics) return <Loader fullScreen />;

  const applicationStatusColors = {
    submitted: 'bg-blue-400',
    reviewed: 'bg-indigo-400',
    interview: 'bg-gold',
    offered: 'bg-green-400',
    accepted: 'bg-emerald-500',
    rejected: 'bg-red-500',
    withdrawn: 'bg-gray-500'
  };

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <BarChart3 className="text-blue-400 w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500">Data Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold font-display text-white">Platform <span className="text-blue-400">Insights</span></h1>
          <p className="text-gray-400 mt-2 italic">Deep dive into platform performance and user engagement metrics.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Applications Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-md">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <Layers className="text-indigo-400" /> Funnel Distribution
                </h3>
                <PieChart size={20} className="text-gray-600" />
             </div>

             <div className="space-y-6">
                {Object.entries(analytics?.applications?.byStatus || {}).map(([status, count], i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{status}</span>
                       <span className="text-sm font-black text-white">{count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${applicationStatusColors[status] || 'bg-white/20'} rounded-full transition-all duration-1000`} 
                         style={{ width: `${(count / (analytics?.applications?.total || 1)) * 100}%` }}
                       ></div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Applications</p>
                   <p className="text-3xl font-black text-white">{analytics?.applications?.total || 0}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Avg Match Score</p>
                   <p className="text-3xl font-black text-indigo-400">84%</p>
                </div>
             </div>
          </div>

          {/* User Growth Snapshot */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
              {/* Background Graph Mockup */}
              <div className="absolute inset-x-0 bottom-0 h-40 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <svg className="w-full h-full" preserveAspectRatio="none">
                    <path d="M0,40 Q50,10 100,30 T200,10 T300,35 T400,5 T500,250" fill="none" stroke="white" strokeWidth="4" />
                 </svg>
              </div>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                   <TrendingUp className="text-green-400" /> Growth & Verification
                </h3>
                <Zap size={20} className="text-gray-600" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <Users className="text-blue-400 mb-3" size={24} />
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Talent Verification</h4>
                   <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-white">{analytics?.users?.verified || 0}</span>
                      <span className="text-xs text-gray-500 pb-1">/ {analytics?.users?.total || 0}</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(analytics?.users?.verified / (analytics?.users?.total || 1)) * 100}%` }}></div>
                   </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                   <Building2 className="text-gold mb-3" size={24} />
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Partner Verification</h4>
                   <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-white">{analytics?.clients?.verified || 0}</span>
                      <span className="text-xs text-gray-500 pb-1">/ {analytics?.clients?.total || 1}</span>
                   </div>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(analytics?.clients?.verified / (analytics?.clients?.total || 1)) * 100}%` }}></div>
                   </div>
                </div>
             </div>

             <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-400 flex items-center gap-2"><Calendar size={14} /> Registered Last 30 Days</span>
                   <span className="text-green-400 font-bold">+{analytics?.users?.newLast30Days + analytics?.clients?.newLast30Days} New</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-400 flex items-center gap-2"><Zap size={14} /> Success Rate (Hires)</span>
                   <span className="text-indigo-400 font-bold">12.4%</span>
                </div>
             </div>
          </div>

        </div>

        {/* Categories Analysis */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                 <Zap className="text-gold" /> Market Dominance
              </h3>
              <p className="text-xs text-gray-500 max-w-md text-right">Comparing active job postings against freelance gig volume across top performing industries.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Top Job Sectors
                 </p>
                 {analytics?.topCategories?.jobs?.map((cat, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-500">{i+1}</div>
                      <div className="flex-1">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 font-bold">{cat._id}</span>
                            <span className="text-gray-500">{cat.count} listings</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400" style={{ width: `${(cat.count / (analytics?.jobs?.total || 1)) * 100}%` }}></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-6">
                 <p className="text-xs font-black uppercase tracking-widest text-gold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold"></div> Top Gig Sectors
                 </p>
                 {analytics?.topCategories?.gigs?.map((cat, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-gray-500">{i+1}</div>
                      <div className="flex-1">
                         <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300 font-bold">{cat._id}</span>
                            <span className="text-gray-500">{cat.count} listings</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gold" style={{ width: `${(cat.count / (analytics?.gigs?.total || 1)) * 100}%` }}></div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
