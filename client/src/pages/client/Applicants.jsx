import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobApplicants, updateApplicationStatus } from '../../redux/slices/applicationSlice';
import { getJobById } from '../../redux/slices/jobSlice';
import DataTable from '../../components/features/DataTable';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ResumePreview from '../../components/features/ResumePreview';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { 
  ArrowLeft, 
  User, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Target, 
  Sparkles,
  Download,
  Calendar,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants, loading: appsLoading } = useSelector((state) => state.applications);
  const { currentJob, loading: jobLoading } = useSelector((state) => state.job);
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(getJobById(id));
    dispatch(getJobApplicants({ jobId: id }));
  }, [dispatch, id]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await dispatch(updateApplicationStatus({ applicationId, status })).unwrap();
      toast.success(`Candidate status updated to ${status}`);
      if (selectedApplicant && selectedApplicant._id === applicationId) {
        setSelectedApplicant({ ...selectedApplicant, status });
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      header: 'CANDIDATE DNA',
      width: '30%',
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-purple/20 to-indigo-600/20 flex items-center justify-center text-electric-purple border border-white/10 overflow-hidden">
               {row.applicant?.profilePicture ? (
                 <img src={row.applicant.profilePicture} alt="" className="w-full h-full object-cover" />
               ) : (
                 <User size={20} />
               )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#030305] ${
              row.status === 'hired' ? 'bg-green-500' : 'bg-gray-500'
            }`}></div>
          </div>
          <div>
            <div className="font-bold text-white text-base">{row.applicant?.name}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{row.applicant?.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'AI MATCH SCORE',
      width: '20%',
      render: (row) => (
         <div className="flex items-center gap-4">
            <div className="flex-grow bg-white/5 h-2 rounded-full overflow-hidden max-w-[100px] border border-white/5">
                <div 
                  className={`h-full animate-width-expand ${
                    row.matchScore >= 80 ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.4)]' : 
                    row.matchScore >= 60 ? 'bg-gold shadow-[0_0_10px_rgba(251,191,36,0.4)]' : 'bg-red-400'
                  }`}
                  style={{ width: `${row.matchScore || 0}%` }}
                ></div>
            </div>
            <span className={`text-sm font-black ${
               row.matchScore >= 80 ? 'text-green-400' : 
               row.matchScore >= 60 ? 'text-gold' : 'text-red-400'
            }`}>{row.matchScore || 0}%</span>
         </div>
      )
    },
    {
      header: 'TRANSMISSION DATE',
      width: '15%',
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-400">
           <Calendar size={12} />
           <span className="text-xs font-bold uppercase tracking-tighter">{formatDate(row.createdAt)}</span>
        </div>
      )
    },
    {
      header: 'STATE',
      width: '15%',
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
          row.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
          row.status === 'interview' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
          row.status === 'hired' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
          'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'OPERATIONS',
      width: '20%',
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="h-9 w-9 p-0 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
            onClick={() => {
              setSelectedApplicant(row);
              setIsResumeOpen(true);
            }}
            title="Inspect Dossier"
          >
            <Eye size={16} className="text-white" />
          </Button>
          <Button 
            size="sm" 
            className="h-9 w-9 p-0 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20"
            onClick={() => handleStatusUpdate(row._id, 'interview')}
            title="Shortlist for Interview"
          >
            <Zap size={16} className="text-green-400" />
          </Button>
          <Button 
            size="sm" 
            className="h-9 w-9 p-0 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"
            onClick={() => handleStatusUpdate(row._id, 'rejected')}
            title="Decline Candidate"
          >
            <XCircle size={16} className="text-red-400" />
          </Button>
        </div>
      )
    }
  ];

  if (jobLoading) return <Loader fullScreen />;

  const filteredApplicants = filterStatus === 'All' 
    ? applicants 
    : applicants.filter(app => app.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-12">
      <div className="container-custom">
        <div className="mb-10">
           <button 
             onClick={() => navigate('/client/dashboard')} 
             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
           >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             <span className="font-bold uppercase tracking-widest text-xs">Return to Orbit</span>
           </button>
           
           <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
             <div className="space-y-2">
               <h4 className="text-electric-purple font-black uppercase tracking-[0.3em] text-[10px]">Candidate Pipeline</h4>
               <h1 className="text-3xl font-black font-display text-white tracking-tight">
                 Applicants for <span className="text-gold italic">"{currentJob?.title}"</span>
               </h1>
               <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-widest">
                     <Target size={14} className="text-gold" />
                     {currentJob?.location?.city}, {currentJob?.location?.country}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-widest">
                     <Users size={14} className="text-electric-purple" />
                     {applicants.length} Total Signals
                  </div>
               </div>
             </div>

             <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
               {['All', 'Pending', 'Interview', 'Rejected', 'Hired'].map(status => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterStatus === status 
                       ? 'bg-white text-black shadow-lg' 
                       : 'text-gray-500 hover:text-white'
                   }`}
                 >
                   {status}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="bg-midnight-800/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden min-h-[500px] relative">
          {/* Decorative scanner effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-scan z-20"></div>
          
          <DataTable
            columns={columns}
            data={filteredApplicants}
            loading={appsLoading}
            pagination={{
              currentPage: 1,
              totalPages: 1
            }}
          />
        </div>

        {/* Dossier (Resume) Modal */}
        <Modal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          title="Candidate Dossier"
          size="lg"
          className="bg-[#030305] border border-white/10 rounded-3xl overflow-hidden"
        >
          {selectedApplicant && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 p-6 rounded-2xl border border-white/10 gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-electric-purple flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    {selectedApplicant.applicant?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedApplicant.applicant?.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedApplicant.status.toLowerCase())}`}>
                        {selectedApplicant.status}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-gold font-black">
                        <Sparkles size={12} />
                        {selectedApplicant.matchScore}% Match
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                   <Button 
                      className="flex-grow md:flex-grow-0 h-11 px-6 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest"
                      onClick={() => handleStatusUpdate(selectedApplicant._id, 'interview')}
                    >
                      Process Shortlist
                   </Button>
                   <Button 
                      variant="danger"
                      className="h-11 w-11 p-0 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500"
                      onClick={() => handleStatusUpdate(selectedApplicant._id, 'rejected')}
                    >
                      <XCircle size={18} />
                   </Button>
                </div>
              </div>

              {/* Resume Component */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Experience Record</h4>
                  <Button variant="ghost" className="text-gold text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Download size={12} /> Extract PDF
                  </Button>
                </div>
                
                {selectedApplicant.resume ? (
                   <div className="bg-midnight-900 border border-white/5 rounded-2xl p-1 min-h-[400px]">
                      <ResumePreview resume={selectedApplicant.resume} />
                   </div>
                ) : (
                  <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-gray-600">
                       <FileText size={32} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Digital Resume Detected</p>
                    <p className="text-gray-600 text-[10px] mt-2 max-w-xs">Applicant has not uploaded a system-readable resume format.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Applicants;
