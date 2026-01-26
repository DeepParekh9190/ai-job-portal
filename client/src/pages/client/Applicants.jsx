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
import { ArrowLeft, User, Eye, CheckCircle, XCircle } from 'lucide-react';

const Applicants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicants, loading: appsLoading } = useSelector((state) => state.applications);
  const { currentJob, loading: jobLoading } = useSelector((state) => state.jobs);
  
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    dispatch(getJobById(id));
    dispatch(getJobApplicants({ jobId: id }));
  }, [dispatch, id]);

  const handleStatusUpdate = async (applicationId, status) => {
    await dispatch(updateApplicationStatus({ applicationId, status }));
    if (selectedApplicant && selectedApplicant._id === applicationId) {
      setSelectedApplicant({ ...selectedApplicant, status });
    }
    // Optimization: could update local state instead of refetching
  };

  const columns = [
    {
      header: 'Candidate',
      width: '30%',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-electric-purple/20 flex items-center justify-center text-electric-purple font-bold">
            {row.applicant?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-white">{row.applicant?.name}</div>
            <div className="text-xs text-gray-500">{row.applicant?.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'AI Match',
      width: '15%',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-midnight-900 h-2 rounded-full overflow-hidden max-w-[80px]">
            <div 
              className={`h-full ${
                row.matchScore >= 80 ? 'bg-green-400' : 
                row.matchScore >= 60 ? 'bg-electric-purple' : 'bg-yellow-400'
              }`}
              style={{ width: `${row.matchScore || 0}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold text-white">{row.matchScore || 0}%</span>
        </div>
      )
    },
    {
      header: 'Applied Date',
      width: '20%',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Status',
      width: '15%',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status.toLowerCase())}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      width: '20%',
      render: (row) => (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => {
              setSelectedApplicant(row);
              setIsResumeOpen(true);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-400 border-green-500/20 hover:bg-green-500/10"
            onClick={() => handleStatusUpdate(row._id, 'interview')}
            title="Schedule Interview"
          >
            <CheckCircle size={16} />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-400 border-red-500/20 hover:bg-red-500/10"
            onClick={() => handleStatusUpdate(row._id, 'rejected')}
            title="Reject"
          >
             <XCircle size={16} />
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
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        <div className="mb-8">
           <Button variant="ghost" onClick={() => navigate('/client/dashboard')} className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
          </Button>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold font-display text-white mb-2">Applicants for {currentJob?.title}</h1>
              <p className="text-gray-400">Manage and review candidates</p>
            </div>
            <div className="flex gap-2">
              {['All', 'Pending', 'Interview', 'Rejected', 'Hired'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    filterStatus === status 
                      ? 'bg-electric-purple text-white' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-midnight-800 border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
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

        {/* Resume Modal */}
        <Modal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          title={`Applicant: ${selectedApplicant?.applicant?.name}`}
          size="lg"
        >
          {selectedApplicant && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplicant.status.toLowerCase())}`}>
                      {selectedApplicant.status}
                    </span>
                  </div>
                   <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">AI Match</p>
                    <span className="text-electric-purple font-bold">{selectedApplicant.matchScore}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(selectedApplicant._id, 'interview')}
                    >
                      Shortlist for Interview
                   </Button>
                   <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleStatusUpdate(selectedApplicant._id, 'rejected')}
                    >
                      Reject
                   </Button>
                </div>
              </div>

              {/* Resume Preview */}
              {selectedApplicant.resume ? (
                 <ResumePreview resume={selectedApplicant.resume} />
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-500">No resume attached or resume is in file format.</p>
                  <Button variant="link" className="mt-2 text-electric-purple">Download Attached File</Button>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Applicants;
