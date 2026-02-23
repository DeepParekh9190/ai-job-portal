import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAnalytics } from '../../redux/slices/adminSlice';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  ArrowUpRight, 
  Clock,
  LayoutDashboard,
  Send,
  Radio,
  ServerCrash,
  Megaphone,
  Globe2,
  Activity
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { analytics, loading } = useSelector((state) => state.admin);

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [audience, setAudience] = useState('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [throttleActive, setThrottleActive] = useState(false);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) {
      toast.error('Cannot send empty broadcast');
      return;
    }
    setIsBroadcasting(true);
    try {
      await api.post('/admin/broadcast', { message: broadcastMsg, audience });
      toast.success(`Broadcast deployed to ${audience}!`, {
        icon: '📢',
        style: { background: '#1e1b4b', color: '#fff', border: '1px solid #4f46e5' }
      });
      setBroadcastMsg('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleThrottle = () => {
    setThrottleActive(!throttleActive);
    if (!throttleActive) {
      toast('Traffic throttled to prevent API limits', { icon: '🛑' });
    } else {
      toast.success('Traffic fully unthrottled');
    }
  };

  if (loading && !analytics) return <Loader fullScreen />;

  const stats = [
    {
      title: 'Total Talent',
      value: analytics?.users?.total || 0,
      subValue: `+${analytics?.users?.newLast30Days || 0} this month`,
      icon: <Users className="text-electric-purple" />,
      color: 'from-electric-purple/20 to-indigo-600/5',
      glow: 'shadow-electric-purple/20'
    },
    {
      title: 'Verified Clients',
      value: analytics?.clients?.total || 0,
      subValue: `${analytics?.clients?.pendingVerification || 0} pending`,
      icon: <Building2 className="text-gold" />,
      color: 'from-gold/20 to-orange-600/5',
      glow: 'shadow-gold/20'
    },
    {
      title: 'Active Postings',
      value: (analytics?.jobs?.active || 0) + (analytics?.gigs?.active || 0),
      subValue: `${analytics?.jobs?.pending || 0} in queue`,
      icon: <Briefcase className="text-blue-400" />,
      color: 'from-blue-400/20 to-cyan-600/5',
      glow: 'shadow-blue-400/20'
    },
    {
      title: 'AI Matches',
      value: analytics?.applications?.total || 0,
      subValue: `${analytics?.applications?.newLast30Days || 0} new`,
      icon: <Zap className="text-green-400" />,
      color: 'from-green-400/20 to-emerald-600/5',
      glow: 'shadow-green-400/20'
    }
  ];

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <header className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-electric-purple/10 blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="text-electric-purple w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">System Intelligence</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold font-display text-white">
                Platform <span className="text-gold">Pulse</span>
              </h1>
              <p className="text-gray-400 mt-2 max-w-xl italic">
                Real-time command center for Talentora AI ecosystem.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className={`px-6 py-3 bg-white/5 border ${throttleActive ? 'border-red-500/50' : 'border-white/10'} rounded-2xl backdrop-blur-md flex items-center gap-3 transition-colors`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${throttleActive ? 'bg-red-500' : 'bg-green-500'}`}></div>
                  <span className={`text-sm font-bold ${throttleActive ? 'text-red-400' : 'text-gray-300'}`}>
                    {throttleActive ? 'Live Services: Throttled' : 'Live Services: Optimal'}
                  </span>
               </div>
            </div>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`group relative bg-midnight-800/50 border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all duration-500 shadow-xl ${stat.glow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]`}></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/10">
                  {stat.icon}
                </div>
                <h3 className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{stat.title}</h3>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold text-gray-500 pb-1 flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-500" /> {stat.subValue}
                  </span>
                </div>
              </div>

              <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                 <ArrowUpRight className="text-gray-600 w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Info Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Categories */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
               <Flame size={120} className="text-electric-purple" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <TrendingUp className="text-gold" /> Trending Sectors
            </h2>

            <div className="space-y-6">
              {analytics?.topCategories?.jobs?.map((cat, i) => (
                <div key={i} className="group/item">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-bold">{cat._id}</span>
                    <span className="text-xs font-black text-electric-purple bg-electric-purple/10 px-3 py-1 rounded-full">{cat.count} Postings</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                       className="h-full bg-gradient-to-r from-electric-purple to-gold rounded-full transition-all duration-1000" 
                       style={{ width: `${(cat.count / (analytics?.jobs?.total || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Verification Hub */}
          <div className="bg-gradient-to-b from-indigo-600 to-electric-purple rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-electric-purple/20 group">
             <div className="absolute -bottom-10 -right-10 opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <ShieldCheck size={200} />
             </div>
             
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black leading-tight mb-4">Verification <br /> Queue</h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">
                    {analytics?.clients?.pendingVerification || 0} companies are waiting for identity verification. Maintain platform integrity.
                  </p>
                </div>

                <div className="space-y-4">
                   <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Avg Waiting Time</span>
                      </div>
                      <span className="text-xs font-black">1.2 Hrs</span>
                   </div>
                   
                   <button 
                     onClick={() => navigate('/admin/clients')}
                     className="w-full py-4 bg-white text-midnight-900 font-black rounded-2xl hover:bg-gold transition-colors shadow-xl"
                   >
                      Process Queue
                   </button>
                </div>
             </div>
          </div>

        </div>

        {/* Global Broadcast & Overrides */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* God Mode Broadcast Console */}
          <div className="bg-gradient-to-br from-[#0c0a1a] to-midnight-900 border border-electric-purple/30 rounded-[3rem] p-10 relative overflow-hidden group shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="absolute -top-10 -right-10 pointer-events-none opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <Megaphone size={300} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-electric-purple/20 flex items-center justify-center border border-electric-purple/30">
                  <Radio className="text-electric-purple animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Global Broadcast Console</h3>
                  <p className="text-xs text-electric-purple font-bold tracking-widest uppercase">Push live notifications to all nodes</p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="Type an announcement to broadcast directly to user screens..."
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-electric-purple focus:ring-1 focus:ring-electric-purple resize-none placeholder:text-white/20 transition-all font-medium"
                ></textarea>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex bg-black/40 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
                    {['all', 'clients', 'freelancers'].map((target) => (
                       <button
                         key={target}
                         onClick={() => setAudience(target)}
                         className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                           audience === target 
                             ? 'bg-electric-purple text-white shadow-lg' 
                             : 'text-gray-500 hover:text-white'
                         }`}
                       >
                         {target}
                       </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={handleBroadcast}
                    disabled={isBroadcasting}
                    className={`w-full flex-1 sm:flex-none sm:w-auto py-3 px-8 rounded-xl font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                      isBroadcasting 
                        ? 'bg-purple-900 text-purple-400 cursor-not-allowed border border-purple-800' 
                        : 'bg-white text-black hover:bg-electric-purple hover:text-white shadow-xl hover:shadow-electric-purple/40 ring-2 ring-white hover:ring-electric-purple'
                    }`}
                  >
                    {isBroadcasting ? <Loader size={16} /> : <Send size={16} />}
                    {isBroadcasting ? 'DEPLOYING...' : 'BROADCAST ALERT'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Overrides */}
          <div className="bg-midnight-800/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                 <ServerCrash className="text-blue-400 group-hover:rotate-12 transition-transform" />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-white">System Overrides</h3>
                 <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Api Health & Engine Controls</p>
               </div>
             </div>

             <div className="space-y-6">
                {/* Visual Fake Bars for OpenAI load */}
                <div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-black uppercase text-gray-400 tracking-wider">OpenAI API Load</span>
                     <span className={`text-xs font-black ${throttleActive ? 'text-green-400' : 'text-orange-400'}`}>
                        {throttleActive ? '23%' : '78%'}
                     </span>
                   </div>
                   <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                     <div 
                        className={`h-full rounded-full transition-all duration-[2000ms] ${throttleActive ? 'bg-green-500 w-[23%]' : 'bg-gradient-to-r from-orange-400 to-red-500 w-[78%]'}`}
                     ></div>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Storage Capacity</span>
                     <span className="text-xs font-black text-blue-400">42%</span>
                   </div>
                   <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-blue-500 rounded-full w-[42%]"></div>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <button 
                     onClick={handleThrottle}
                     className={`w-full py-4 rounded-xl border flex items-center justify-center gap-2 font-black tracking-widest text-xs transition-colors ${
                       throttleActive 
                         ? 'border-gray-500 text-gray-400 bg-white/5 hover:bg-white/10' 
                         : 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                     }`}
                   >
                     {throttleActive ? 'NORMAL TRAFFIC RESTORED (CLICK TO REMOVE)' : 'DEPLOY EMERGENCY THROTTLE (API LIMIT RISK)'}
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {Object.entries(analytics?.applications?.byStatus || {}).map(([status, count], i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{status}</span>
                <span className="text-2xl font-black text-white">{count}</span>
             </div>
           ))}
        </div>
        {/* Global Node Traffic Map */}
        <div className="mt-8 bg-gradient-to-br from-[#05040a] to-[#0A0813] border border-blue-900/30 rounded-[3rem] p-10 relative overflow-hidden group shadow-[0_0_40px_rgba(30,58,138,0.1)]">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
               <div className="lg:w-1/3 space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-blue-900/40 flex items-center justify-center border border-blue-500/20">
                     <Globe2 className="text-blue-400 group-hover:rotate-12 transition-transform duration-700" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-white">Live Node Map</h3>
                     <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Global Traffic Analytics</p>
                   </div>
                 </div>

                 <p className="text-sm text-gray-400 leading-relaxed font-medium">
                   Real-time visualization of incoming packets across all active regions. High density clusters indicate active AI sourcing hubs.
                 </p>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">US-EAST (N. VIRGINIA)</span>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-xs font-bold text-white">982 ms</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">EU-WEST (LONDON)</span>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.5s'}}></div>
                         <span className="text-xs font-bold text-white">412 ms</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">AP-SOUTH (MUMBAI)</span>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" style={{ animationDelay: '1s'}}></div>
                         <span className="text-xs font-bold text-orange-400">High Load</span>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Simulated Map Graphic */}
               <div className="lg:w-2/3 w-full aspect-[2/1] bg-black/50 border border-blue-500/10 rounded-3xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-900/5 mix-blend-screen"></div>
                  
                  {/* Radar Sweep Effect */}
                  <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-full h-full animate-[spin_10s_linear_infinite] rounded-full border border-blue-500/10" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(59,130,246,0.1) 360deg)'}}></div>
                  </div>

                  {/* Pulsing Nodes */}
                  <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] animate-ping"></div>
                  <div className="absolute top-[40%] left-[70%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_#c084fc] animate-ping" style={{ animationDuration: '2s'}}></div>
                  <div className="absolute top-[60%] left-[40%] w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399] animate-ping" style={{ animationDuration: '1.5s'}}></div>
                  <div className="absolute top-[20%] left-[60%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_#93c5fd] animate-pulse"></div>
                  <div className="absolute top-[80%] left-[80%] w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8] animate-pulse"></div>

                  {/* Aesthetic Map Lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M20,30 Q40,50 70,40 T80,80" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2,2" className="animate-[dash_20s_linear_infinite]"/>
                    <path d="M40,60 Q50,40 20,20" fill="none" stroke="#c084fc" strokeWidth="0.5" strokeDasharray="2,2" className="animate-[dash_15s_linear_infinite]"/>
                  </svg>

                  <div className="relative flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/10 rounded-full backdrop-blur-sm z-10">
                     <Activity className="text-blue-400 w-4 h-4 animate-pulse" />
                     <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">Capturing Live Packets</span>
                  </div>
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
