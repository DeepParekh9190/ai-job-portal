import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyJobs, deleteJob } from '../../redux/slices/jobSlice';
import DataTable from '../../components/features/DataTable';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatDate, formatSalary } from '../../utils/helpers';
import { 
  Briefcase, 
  MapPin, 
  Users, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myJobs, loading, pagination } = useSelector((state) => state.job);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMyJobs({ page: 1 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(id)).unwrap();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handlePageChange = (page) => {
    dispatch(getMyJobs({ page, keyword: searchTerm }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Debounced search logic could be added here
    dispatch(getMyJobs({ page: 1, keyword: value }));
  };

  const columns = [
    {
      header: 'Job Info',
      width: '40%',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-white text-base">{row.title}</span>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Briefcase size={12} /> {row.jobType}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {row.location?.city}, {row.location?.country}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Applicants',
      width: '15%',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="bg-electric-purple/10 p-2 rounded-lg">
            <Users size={16} className="text-electric-purple" />
          </div>
          <span className="font-medium text-white">{row.applicationCount || 0}</span>
        </div>
      )
    },
    {
      header: 'Salary Range',
      width: '15%',
      render: (row) => (
        <span className="text-gray-300 font-medium whitespace-nowrap">
          {formatSalary(row.salary?.min)} - {formatSalary(row.salary?.max)}
        </span>
      )
    },
    {
      header: 'Status',
      width: '15%',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          row.status === 'active' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : row.status === 'pending'
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    },
    {
      header: 'Actions',
      width: '15%',
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <Link to={`/client/jobs/${row._id}/applicants`} title="View Applicants">
            <Button size="icon" variant="secondary" className="w-8 h-8 rounded-lg">
              <Eye size={14} />
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-lg"
            onClick={() => navigate(`/client/jobs/${row._id}/edit`)}
            title="Edit Job"
          >
            <Edit size={14} />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-lg text-red-400 hover:text-red-300"
            onClick={() => handleDelete(row._id)}
            title="Delete Job"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-12">
      <div className="container-custom">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black font-display text-white tracking-tight flex items-center gap-3">
              <Briefcase className="text-gold" size={32} />
              MY POSTED <span className="text-gold">JOBS</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your job listings and track applicants.</p>
          </div>
          <Link to="/client/post-job">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-electric-purple to-indigo-600 border-none shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={18} /> POST NEW JOB
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-electric-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </Link>
        </div>

        {/* Dashboard Grid for Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-electric-purple/20 flex items-center justify-center text-electric-purple">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Jobs</p>
              <h3 className="text-2xl font-black text-white">{pagination.total || 0}</h3>
            </div>
          </Card>
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Candidates</p>
              <h3 className="text-2xl font-black text-white">
                {myJobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0)}
              </h3>
            </div>
          </Card>
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Pending Review</p>
              <h3 className="text-2xl font-black text-white">
                {myJobs.filter(job => job.status === 'pending').length}
              </h3>
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="relative">
          {/* Decorative effect */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-electric-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="bg-midnight-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative z-10">
            <DataTable
              columns={columns}
              data={myJobs}
              loading={loading}
              onSearch={handleSearch}
              searchPlaceholder="Search job titles..."
              pagination={{
                currentPage: pagination.page,
                totalPages: pagination.pages
              }}
              onPageChange={handlePageChange}
            />

            {!loading && myJobs.length === 0 && (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Briefcase size={40} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No jobs found</h3>
                <p className="text-gray-400 max-w-md mb-8">
                  You haven't posted any jobs yet, or no jobs match your search criteria.
                </p>
                <Link to="/client/post-job">
                  <Button variant="outline" className="border-white/20 hover:bg-white/5">
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
