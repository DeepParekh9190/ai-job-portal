import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserStatus, getAllClients, updateClientStatus } from '../../redux/slices/adminSlice';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Filter,
  User as UserIcon,
  ShieldAlert,
  Activity,
  Radar,
  MapPin,
  AlertOctagon,
  Fingerprint,
  Terminal,
  Crosshair,
  Wifi,
  Lock
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { getRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, clients, loading, pagination } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tab State
  const [activeTab, setActiveTab] = useState('freelancers'); // 'freelancers' | 'clients'
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for AI Talent Surveillance
  const [selectedUser, setSelectedUser] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    setSelectedUser(null);
    if (activeTab === 'freelancers') {
      dispatch(getAllUsers({ search: searchTerm, page: currentPage }));
    } else {
      dispatch(getAllClients({ search: searchTerm, page: currentPage }));
    }
  }, [dispatch, searchTerm, activeTab, currentPage]);

  // Reset page when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const currentData = activeTab === 'freelancers' ? users : clients;

  const handleDeepScan = (user) => {
    setSelectedUser(user);
    setIsScanning(true);
    toast('Initiating Deep Neural Scan...', { icon: '🧠', style: { background: '#1e1b4b', color: '#fff' } });
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Surveillance Profile Generated', { style: { background: '#1e1b4b', color: '#fff' } });
    }, 2500);
  };

  const handleQuarantine = (user) => {
    const isClient = activeTab === 'clients';
    const name = isClient ? (user.company?.name || user.name) : user.name;
    toast.error(user.isActive ? `Quarantine Sequence Initiated for ${name}!` : `Clearance Restored for ${name}`, { 
      icon: user.isActive ? '🚨' : '✅', 
      style: { background: user.isActive ? '#450a0a' : '#064e3b', color: '#fff', border: user.isActive ? '1px solid #ef4444' : '1px solid #10b981' } 
    });
    
    if (isClient) {
      dispatch(updateClientStatus({ id: user._id, isActive: !user.isActive }));
    } else {
      dispatch(updateUserStatus({ id: user._id, isActive: !user.isActive }));
    }
    
    setSelectedUser({ ...user, isActive: !user.isActive });
  };

  if (loading && users.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-electric-purple/10 rounded-lg">
                <Users className="text-electric-purple w-5 h-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Universal Directory</span>
            </div>
            <h1 className="text-4xl font-bold font-display text-white">Manage <span className="text-electric-purple">Accounts</span></h1>
            <p className="text-gray-400 mt-2">Monitor and surveil all nodes connected to the platform ecosystem.</p>
          </div>

          <div className="flex gap-4">
             <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('freelancers')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                     activeTab === 'freelancers' ? 'bg-electric-purple text-white shadow-lg shadow-electric-purple/20' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Freelancers
                </button>
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                     activeTab === 'clients' ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Enterprise
                </button>
             </div>
             <div className="relative w-full md:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder={`Search ${activeTab}...`}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:border-electric-purple outline-none transition-all h-full"
               />
             </div>
          </div>
        </header>

        {/* Main Framework */}
        <div className="flex flex-col xl:flex-row gap-8">
          
          {/* User List Panel */}
          <div className={`transition-all duration-700 ease-in-out ${selectedUser ? 'xl:w-[60%]' : 'w-full'}`}>
             <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-b border-white/5 bg-white/[0.02]">
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">User Profile</th>
                       <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hidden md:table-cell">Status</th>
                       <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {currentData.map((user) => {
                       const isClient = activeTab === 'clients';
                       const displayName = isClient ? (user.company?.name || user.name) : user.name;
                       const displayImage = isClient ? user.company?.logo?.url : user.avatar?.url;
                       
                       return (
                       <tr 
                         key={user._id} 
                         onClick={() => handleDeepScan(user)}
                         className={`hover:bg-white/[0.04] transition-colors group cursor-pointer ${selectedUser?._id === user._id ? 'bg-indigo-900/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}
                       >
                         <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isClient ? 'from-gold/20 to-midnight-800' : 'from-midnight-700 to-midnight-800'} flex items-center justify-center border border-white/10 text-xl font-bold text-white shadow-lg overflow-hidden flex-shrink-0 ${!user.isActive && 'grayscale opacity-50'}`}>
                                {displayImage ? (
                                  <img src={displayImage} alt="" className={`w-full h-full ${isClient ? 'object-contain p-1' : 'object-cover'}`} />
                                ) : (
                                  displayName?.charAt(0) || '?'
                                )}
                             </div>
                             <div className="min-w-0">
                               <h4 className="font-bold text-white group-hover:text-electric-purple transition-colors truncate">{displayName}</h4>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="flex items-center gap-1 text-xs text-gray-500 truncate"><Mail size={12} /> {user.email}</span>
                               </div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-6 hidden md:table-cell">
                           <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2">
                                {(isClient ? user.isVerified : user.isEmailVerified) ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 border border-green-500/20 bg-green-500/5 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={10} /> Verified
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                                    <XCircle size={10} /> Pending
                                  </span>
                                )}
                             </div>
                             <span className={`text-[10px] font-black uppercase tracking-wider ${user.isActive ? 'text-gray-400' : 'text-red-400'}`}>
                               {user.isActive ? (isClient ? 'Active Partner' : 'Active Member') : 'Quarantined'}
                             </span>
                           </div>
                         </td>
                         <td className="px-6 py-6 text-right">
                           <button className="px-4 py-2 bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto">
                             <Crosshair size={14} /> <span className="hidden sm:inline">Deep Scan</span>
                           </button>
                         </td>
                       </tr>
                     )})}
                   </tbody>
                 </table>
               </div>

               {currentData.length === 0 && !loading && (
                 <div className="py-20 text-center">
                    <UserIcon size={48} className="text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No targets found</h3>
                    <p className="text-gray-600 max-w-xs mx-auto text-sm mt-1">Adjust your radar parameters.</p>
                 </div>
               )}

               {/* Pagination */}
               {pagination.pages > 1 && (
                 <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing {((pagination.page - 1) * 20) + 1} - {((pagination.page - 1) * 20) + currentData.length} of {pagination.total} records</span>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                         className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all disabled:opacity-50" 
                         disabled={pagination.page === 1}
                       >
                         Previous
                       </button>
                       <button 
                         onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                         className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-all disabled:opacity-50" 
                         disabled={pagination.page === pagination.pages}
                       >
                         Next
                       </button>
                    </div>
                 </div>
               )}
             </div>
          </div>

          {/* AI Surveillance Terminal Panel */}
          {selectedUser && (
            <div className="xl:w-[40%] animate-in slide-in-from-right-8 duration-700 h-fit bg-[#0c0a1a] border border-red-900/30 rounded-[2.5rem] overflow-hidden relative shadow-[0_0_40px_rgba(220,38,38,0.15)]">
               {/* Terminal Grid Background Layer */}
               <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>
               
               {isScanning ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center h-full min-h-[600px] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 overflow-hidden">
                       <div className="h-full bg-red-500 w-[15%] animate-[scan_1.5s_ease-in-out_infinite_alternate]"></div>
                    </div>
                    <Radar className="text-red-500 w-20 h-20 animate-[spin_3s_linear_infinite] mb-8" />
                    <h3 className="text-2xl font-black text-white tracking-widest mb-3 uppercase font-display">Neural Grid Scan</h3>
                    <p className="text-red-400 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Running identity heuristics...</p>
                  </div>
               ) : (
                  <div className="p-10 relative">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between border-b border-red-900/30 pb-6 mb-8">
                      <div className="flex items-center gap-3 text-red-500">
                        <Terminal size={20} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Surveillance Profile</span>
                      </div>
                      <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                        <Wifi size={12} className="animate-pulse" /> Live Tracking
                      </div>
                    </div>

                    {/* Target Avatar Block */}
                    <div className="flex flex-col items-center mb-10">
                      <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-b from-red-900/50 to-black border-2 border-red-500/30 mb-5 p-1.5 relative shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                        <div className="absolute -inset-3 rounded-[2rem] border border-red-500/20 animate-[spin_15s_linear_infinite] border-dashed pointer-events-none"></div>
                        <img 
                           src={
                             (activeTab === 'clients' ? selectedUser.company?.logo?.url : selectedUser.avatar?.url) || 
                             `https://ui-avatars.com/api/?name=${encodeURIComponent(activeTab === 'clients' ? (selectedUser.company?.name || selectedUser.name) : selectedUser.name)}&background=1e1b4b&color=fff`
                           } 
                           alt="" 
                           className={`w-full h-full rounded-[1.7rem] ${activeTab === 'clients' ? 'object-contain' : 'object-cover'} ${!selectedUser.isActive && 'grayscale opacity-60'}`} 
                        />
                        {!selectedUser.isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 rounded-[1.7rem] backdrop-blur-[2px]">
                            <Lock className="text-red-500" />
                          </div>
                        )}
                      </div>
                      <h2 className="text-3xl font-black text-white font-display text-center leading-tight mb-1">
                        {activeTab === 'clients' ? (selectedUser.company?.name || selectedUser.name) : selectedUser.name}
                      </h2>
                      <p className="text-red-400/70 font-mono text-[10px] tracking-widest break-all">ID: {selectedUser._id}</p>
                    </div>

                    {/* Data Matrices */}
                    <div className="space-y-6 mb-10">
                      {/* Trust Score */}
                      <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${selectedUser.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="flex items-center justify-between mb-4 pl-2">
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-2">
                            <Activity size={14} className={selectedUser.isActive ? 'text-green-500' : 'text-red-500'} /> AI Trust factor
                          </span>
                          <span className={`text-2xl font-black ${selectedUser.isActive ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedUser.isActive ? '92%' : '14%'}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden ml-2">
                          <div className={`h-full ${selectedUser.isActive ? 'bg-green-500 w-[92%] shadow-[0_0_10px_#22c55e]' : 'bg-red-500 w-[14%] shadow-[0_0_10px_#ef4444]'}`}></div>
                        </div>
                      </div>

                      {/* Network Data Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-2">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-indigo-400" /> Origin IP</span>
                          <span className="text-xs text-indigo-200 font-mono">192.168.{Math.floor(selectedUser._id.charCodeAt(0) % 255)}.{Math.floor(selectedUser._id.charCodeAt(1) % 255)}</span>
                        </div>
                        <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-2">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5"><Fingerprint size={12} className="text-indigo-400" /> Device Hash</span>
                          <span className="text-[11px] text-indigo-200 font-mono truncate">0x{selectedUser._id.substring(0,8)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-2">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> Member Since</span>
                          <span className="text-xs text-white font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-5 flex flex-col gap-2">
                          <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1.5"><Phone size={12} className="text-indigo-400" /> Telecom Data</span>
                          <span className="text-xs text-white font-medium truncate">{selectedUser.phone || 'Classified'}</span>
                        </div>
                      </div>

                      {/* AI Risk Terminal Block */}
                      <div className={`border rounded-[1.5rem] p-6 relative overflow-hidden ${selectedUser.isActive ? 'bg-indigo-900/10 border-indigo-500/20' : 'bg-red-900/10 border-red-500/20'}`}>
                         <div className="absolute top-0 right-0 p-4 opacity-10">
                            {selectedUser.isActive ? <CheckCircle2 size={60} /> : <AlertOctagon size={60} />}
                         </div>
                         <div className="flex items-start gap-4 relative z-10">
                           {selectedUser.isActive ? (
                             <Activity className="text-indigo-400 mt-0.5 flex-shrink-0" size={18} />
                           ) : (
                             <AlertOctagon className="text-red-400 mt-0.5 flex-shrink-0" size={18} />
                           )}
                           
                           <div>
                             <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${selectedUser.isActive ? 'text-indigo-400' : 'text-red-400'}`}>
                               Risk Analysis Core
                             </h4>
                             <p className={`text-xs leading-relaxed ${selectedUser.isActive ? 'text-indigo-200/80' : 'text-red-200/80 font-mono'}`}>
                               {selectedUser.isActive 
                                 ? 'User exhibits natural browsing patterns. No automated scraping detected. Location heuristic is consistent with IP origin.'
                                 : '> CRITICAL: Multi-node login attempts detected.\n> Application velocity exceeds human limits.\n> Suspected bot network. Assets frozen.'}
                             </p>
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* The Nuclear Button */}
                    <button 
                      onClick={() => handleQuarantine(selectedUser)}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                        selectedUser.isActive 
                          ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] border border-red-400/50' 
                          : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] border border-emerald-400/50'
                      }`}
                    >
                      {selectedUser.isActive ? (
                        <><ShieldAlert size={18} className="animate-pulse" /> INITIATE QUARANTINE</>
                      ) : (
                        <><Lock size={18} /> RESTORE CLEARANCE</>
                      )}
                    </button>
                    
                  </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
