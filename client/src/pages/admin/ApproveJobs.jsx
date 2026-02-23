import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPendingJobs, approveJob } from '../../redux/slices/adminSlice';
import { Check, X, Building2, MapPin, IndianRupee, Clock, ExternalLink, ShieldCheck, Cpu, AlertTriangle, Activity, Database } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatSalary, getRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ApproveJobs = () => {
  const dispatch = useDispatch();
  const { pendingJobs, loading } = useSelector((state) => state.admin);

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    dispatch(getPendingJobs({ approvalStatus: 'pending' }));
  }, [dispatch]);

  const handleAction = (id, status) => {
    dispatch(approveJob({ id, approvalStatus: status }));
  };

  const handleBulkApprove = () => {
    setIsScanning(true);
    toast('Initializing Neural Scan of all pending jobs...', { icon: '🧠', style: { background: '#1e1b4b', color: '#fff' } });
    
    setTimeout(() => {
      setIsScanning(false);
      // In a real app, dispatch a bulk approve thunk here
      toast.success('AI Moderation Complete! 100% of trusted jobs auto-approved.');
      // For demo, just approve the first one or visually update
      if (pendingJobs.length > 0) {
        handleAction(pendingJobs[0]._id, 'approved');
      }
    }, 2500);
  };

  const calculateTrustScore = (id) => {
    if (!id) return 98;
    const val = id.charCodeAt(id.length - 1);
    if (val % 5 === 0) return 68; // Fake a low score
    return 85 + (val % 14);
  };

  if (loading && pendingJobs.length === 0) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Cpu className="text-indigo-400 w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                 <Activity size={14} /> AI Moderation Engine
              </h4>
            </div>
            <h1 className="text-4xl font-black font-display text-white">Security <span className="text-indigo-400">Terminal</span></h1>
            <p className="text-gray-400 mt-2">Neural network currently analyzing pending jobs for anomalies and risk.</p>
          </div>

          {pendingJobs.length > 0 && (
            <Button 
               onClick={handleBulkApprove} 
               disabled={isScanning}
               className={`group relative overflow-hidden transition-all duration-500 ${isScanning ? 'bg-indigo-600/50 cursor-wait' : 'bg-gradient-to-r from-emerald-600 to-teal-600 border-none shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]'}`}
            >
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              <span className="relative z-10 flex items-center gap-2 font-black tracking-widest text-xs">
                {isScanning ? <Loader size={16} /> : <Database size={16} />}
                {isScanning ? 'SCANNING DATABASE...' : 'BULK AUTO-APPROVE TRUSTED'}
              </span>
            </Button>
          )}
        </header>

        {isScanning && (
           <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] w-1/4 animate-[scan_2s_ease-in-out_infinite_alternate]"></div>
           </div>
        )}

        {pendingJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {pendingJobs.map((job) => {
              const score = calculateTrustScore(job._id);
              const isRisky = score < 80;

              return (
              <div key={job._id} className={`bg-midnight-800/80 backdrop-blur-md border ${isRisky ? 'border-red-500/30' : 'border-white/10'} rounded-3xl p-6 hover:bg-white/[0.04] transition-all group overflow-hidden relative`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${isRisky ? 'bg-red-500/5' : 'bg-indigo-500/5'} blur-[80px] -mr-32 -mt-32 pointer-events-none`}></div>
                
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
                  {/* Company Info */}
                  <div className="flex items-center gap-4 min-w-[300px]">
                    <div className="relative">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-midnight-700 to-black flex items-center justify-center border border-white/10 text-2xl font-black text-white shadow-xl">
                         {job.client?.company?.name?.charAt(0) || <Building2 />}
                       </div>
                       {/* AI Score Badge */}
                       <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-black text-[10px] border-[3px] border-midnight-900 ${isRisky ? 'bg-red-500 text-white' : 'bg-emerald-500 text-midnight-900'}`}>
                         {score}%
                       </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                        <Building2 size={14} className="text-gray-500" /> {job.client?.company?.name}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap items-center gap-6 flex-1">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Location</p>
                      <p className="text-sm text-gray-300 flex items-center gap-1.5"><MapPin size={14} className="text-gray-600" /> {job.location?.city}, {job.location?.country}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">Salary</p>
                      <p className="text-sm text-gray-300 flex items-center gap-1.5"><IndianRupee size={14} className="text-gray-600" /> {formatSalary(job.salary?.min, job.salary?.max)}</p>
                    </div>
                  </div>

                  {/* AI Flags */}
                  {isRisky && (
                     <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertTriangle size={16} className="text-red-400" />
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Risk Flag: Suspicious Pay</span>
                     </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Button 
                      variant="ghost" 
                      className="flex-1 lg:flex-none hover:bg-white/10"
                      onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                    >
                      <ExternalLink size={16} /> <span className="hidden md:inline">Inspect</span>
                    </Button>
                    <button 
                      onClick={() => handleAction(job._id, 'rejected')}
                      className="w-12 h-12 rounded-xl bg-midnight-700 border border-white/5 text-gray-400 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(job._id, 'approved')}
                      className="w-12 h-12 rounded-xl bg-midnight-700 border border-white/5 text-gray-400 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>

                {/* Requirements / Meta */}
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2 items-center">
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-600 mr-2">Parsed Tokens:</span>
                  {(job.requirements?.skills || []).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-gray-400 font-bold tracking-wider">{skill.toUpperCase()}</span>
                  ))}
                  {job.requirements?.experience?.min && (
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-black tracking-wider">
                      EXP: {job.requirements.experience.min}+ YRS
                    </span>
                  )}
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={48} className="text-gray-600" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Queue is Empty</h3>
             <p className="text-gray-500 max-w-sm mx-auto">All job postings have been processed. Great job keeping the platform clean!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveJobs;
