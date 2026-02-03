import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyJobs } from '../../redux/slices/jobSlice';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  MoreVertical, 
  Eye, 
  Zap,
  Sparkles,
  ArrowRight,
  Target,
  Rocket
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatSalary, getRelativeTime } from '../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock chart data
const statsData = [
  { name: 'Mon', views: 24, applications: 4 },
  { name: 'Tue', views: 45, applications: 8 },
  { name: 'Wed', views: 32, applications: 6 },
  { name: 'Thu', views: 55, applications: 12 },
  { name: 'Fri', views: 68, applications: 15 },
  { name: 'Sat', views: 40, applications: 7 },
  { name: 'Sun', views: 35, applications: 5 },
];

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.job);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const stats = [
    { 
      title: 'Active Jobs', 
      value: myJobs?.length || 0, 
      icon: <Briefcase className="w-5 h-5 text-blue-400" />,
      color: 'blue'
    },
    { 
      title: 'Total Apps', 
      value: myJobs?.reduce((acc, job) => acc + (job.applicationCount || 0), 0) || '142', 
      icon: <Users className="w-5 h-5 text-electric-purple" />,
      color: 'purple'
    },
    { 
      title: 'Success Rate', 
      value: '84%', 
      icon: <Target className="w-5 h-5 text-green-400" />,
      color: 'green'
    },
    { 
      title: 'AI Matches', 
      value: '12', 
      icon: <Sparkles className="w-5 h-5 text-gold" />,
      color: 'gold'
    },
  ];

  if (loading && !myJobs) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-12">
      <div className="container-custom">
        {/* Top Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h4 className="text-gold font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Employer Command Center</h4>
            <h1 className="text-4xl font-black font-display text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{user?.companyName || user?.name}</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-glow"></span>
               System operational. 3 new applications since your last login.
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/client/post-job">
              <Button className="bg-white text-black hover:bg-gray-200 border-none font-bold px-6 h-12 rounded-xl flex items-center gap-2">
                <Plus size={18} /> Post Job
              </Button>
            </Link>
            <Link to="/client/post-gig">
              <Button variant="secondary" className="bg-white/5 text-white border-white/10 hover:bg-white/10 font-bold px-6 h-12 rounded-xl flex items-center gap-2">
                <Zap size={18} className="text-indigo-400" /> Post Gig
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-midnight-800/40 backdrop-blur-xl border border-white/5 hover:border-gold/30 transition-all group overflow-hidden relative">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <TrendingUp size={16} className="text-green-500 opacity-50" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white mb-1">{stat.value}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.title}</p>
                </div>
              </div>
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent -translate-y-12 translate-x-12 rounded-full blur-2xl"></div>
            </Card>
          ))}
        </div>

        {/* AI Insight Bar */}
        <div className="mb-10">
           <div className="bg-gradient-to-r from-electric-purple/20 via-indigo-600/10 to-transparent border-l-4 border-electric-purple p-6 rounded-r-3xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:translate-x-1">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-electric-purple flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Sparkles className="text-white" size={24} />
                 </div>
                 <div>
                    <h4 className="text-white font-bold text-lg">AI Talent Recommendation</h4>
                    <p className="text-gray-400 text-sm">We've found <span className="text-white font-bold">5 candidates</span> matching your "Senior React Dev" requirements with 95%+ DNA compatibility.</p>
                 </div>
              </div>
              <Button variant="outline" className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple hover:text-white rounded-xl px-6">
                Review Matches
              </Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Main Chart Area */}
          <div className="lg:col-span-8">
            <Card className="bg-midnight-800/40 backdrop-blur-xl border border-white/5 p-8 h-full">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-bold text-white">Engagement Overview</h3>
                   <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">Growth Metrics</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-electric-purple"></span> Applications
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-white opacity-20"></span> Views
                   </div>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff20" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#ffffff20" tick={{fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      cursor={{ stroke: '#a855f7', strokeWidth: 2 }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#ffffff20" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="applications" stroke="#a855f7" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" shadow="0 10px 20px rgba(168,85,247,0.4)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Quick Actions / Recent Activity */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="bg-midnight-800/40 backdrop-blur-xl border border-white/5 p-8 flex flex-col">
                <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Recent Broadcasts</h3>
                <div className="space-y-6 flex-grow">
                  {[
                    { text: 'New application for "Senior AI Dev"', time: '2 mins ago', icon: <Users size={14} />, color: 'purple' },
                    { text: 'Security scan completed: 0 threats', time: '1 hour ago', icon: <Target size={14} />, color: 'green' },
                    { text: 'Billing: Premium tier renewed', time: '5 hours ago', icon: <Rocket size={14} />, color: 'gold' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                       <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors`}>
                          <div className={`text-${item.color}-400`}>{item.icon}</div>
                       </div>
                       <div>
                          <p className="text-sm text-gray-300 font-medium">{item.text}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 mt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[.2em] text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                   View System Logs <ArrowRight size={12} />
                </button>
             </Card>

             <Card className="bg-gradient-to-br from-midnight-900 to-black border border-white/5 p-8 overflow-hidden relative">
                <div className="relative z-10">
                  <h4 className="text-white font-bold mb-2">Need specialized help?</h4>
                  <p className="text-xs text-gray-500 mb-6">Our AI recruiting agents can help you source candidates while you sleep.</p>
                  <Button className="w-full bg-electric-purple text-white border-none py-6 rounded-2xl font-black tracking-widest text-xs shadow-lg shadow-electric-purple/20">
                    ACTIVATE AI AGENT
                  </Button>
                </div>
                <Sparkles className="absolute -right-8 -bottom-8 w-32 h-32 text-electric-purple opacity-5" />
             </Card>
          </div>
        </div>

        {/* Featured Jobs Management */}
        <div>
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-gold rounded-full"></div>
               <h2 className="text-2xl font-black text-white">COMMAND LISTING</h2>
             </div>
             <Link to="/client/jobs" className="text-gold text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
                View All Files <ArrowRight size={14} />
             </Link>
          </div>
          
          <div className="bg-midnight-800/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden p-2">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-white/5 rounded-2xl overflow-hidden">
                   <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-500">Resource Name</th>
                   <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-500">Pipeline State</th>
                   <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-500">Health Score</th>
                   <th className="p-5 text-xs font-black uppercase tracking-widest text-gray-500 text-right">Access</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {myJobs?.slice(0, 4).map((job) => (
                   <tr key={job._id} className="hover:bg-white/5 transition-colors group">
                     <td className="p-5">
                       <div className="font-bold text-white text-base group-hover:text-gold transition-colors">{job.title}</div>
                       <div className="text-[10px] font-black tracking-widest text-gray-500 uppercase mt-1">{job.jobType} • {job.location?.city}</div>
                     </td>
                     <td className="p-5">
                        <div className="flex items-center gap-3">
                           <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full animate-width-expand" style={{ width: `${(job.applicationCount || 5) * 10}%` }}></div>
                           </div>
                           <span className="text-xs font-bold text-white">{job.applicationCount || 0}</span>
                        </div>
                     </td>
                     <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          job.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                        }`}>
                          {job.status === 'active' ? 'Operational' : 'Paused'}
                        </span>
                     </td>
                     <td className="p-5 text-right">
                        <Link to={`/client/jobs/${job._id}/applicants`}>
                          <Button variant="ghost" className="text-white hover:bg-gold hover:text-midnight-900 border border-white/10 rounded-xl px-4 text-xs font-bold uppercase transition-all">
                            Manage
                          </Button>
                        </Link>
                     </td>
                   </tr>
                 ))}
                 {(!myJobs || myJobs.length === 0) && (
                   <tr>
                     <td colSpan={4} className="p-20 text-center">
                        <div className="flex flex-col items-center">
                           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                              <Briefcase size={24} className="text-gray-600" />
                           </div>
                           <p className="text-gray-400 font-medium">No active commands found in orbit.</p>
                           <Link to="/client/post-job" className="mt-4 text-gold text-xs font-black uppercase tracking-widest hover:underline">Launch your first mission</Link>
                        </div>
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
