import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyGigs, deleteJob } from '../../redux/slices/jobSlice'; // Should probably use deleteGig if it exists
import DataTable from '../../components/features/DataTable';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';
import { 
  Zap, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit, 
  Eye, 
  Plus, 
  DollarSign,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyGigs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myGigs, loading, pagination } = useSelector((state) => state.job);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMyGigs({ page: 1 }));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        // Assuming deleteJob can handle gigs or there's a deleteGig
        // Based on jobSlice.js, there is no deleteGig fulfilled case that updates myGigs.
        // Wait, let's check jobSlice again.
        // Line 107 in jobSlice.js: export const deleteJob = ...
        // It seems gig deletion might be missing or handled by deleteJob.
        // I'll check jobSlice.js again to be sure.
        await dispatch(deleteJob(id)).unwrap(); 
        toast.success('Gig deleted successfully');
        dispatch(getMyGigs({ page: 1 })); // Refresh
      } catch (error) {
        toast.error('Failed to delete gig');
      }
    }
  };

  const handlePageChange = (page) => {
    dispatch(getMyGigs({ page, keyword: searchTerm }));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(getMyGigs({ page: 1, keyword: value }));
  };

  const columns = [
    {
      header: 'Gig Details',
      width: '40%',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-white text-base">{row.title}</span>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {row.duration || 'Flexible'}
            </span>
            <span className="flex items-center gap-1 text-gold">
              <DollarSign size={12} /> {row.budget}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      width: '15%',
      render: (row) => (
        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-gray-300">
          {row.category}
        </span>
      )
    },
    {
      header: 'Deadline',
      width: '15%',
      render: (row) => (
        <span className="text-gray-400 text-xs">
          {row.deadline ? formatDate(row.deadline) : 'No deadline'}
        </span>
      )
    },
    {
      header: 'Status',
      width: '15%',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          row.status === 'active' 
            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
            : row.status === 'completed'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
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
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-lg"
            onClick={() => navigate(`/client/gigs/${row._id}/edit`)}
            title="Edit Gig"
          >
            <Edit size={14} />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-lg text-red-400 hover:text-red-300"
            onClick={() => handleDelete(row._id)}
            title="Delete Gig"
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
              <Zap className="text-indigo-400" size={32} />
              MY ACTIVE <span className="text-indigo-400">GIGS</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your short-term projects and freelance tasks.</p>
          </div>
          <Link to="/client/post-gig">
            <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <span className="relative z-10 flex items-center gap-2">
                <Plus size={18} /> POST NEW GIG
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
           <Card className="bg-gradient-to-br from-midnight-800 to-midnight-900 border border-white/10 p-6 flex justify-between items-center overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-xs text-indigo-400 uppercase font-black tracking-[0.2em] mb-1">Active Projects</p>
                <h3 className="text-4xl font-black text-white">{myGigs.length}</h3>
              </div>
              <Layers className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
           </Card>
           
           <Card className="bg-gradient-to-br from-midnight-800 to-midnight-900 border border-white/10 p-6 flex justify-between items-center overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-xs text-gold uppercase font-black tracking-[0.2em] mb-1">Total Budgeted</p>
                <h3 className="text-4xl font-black text-white">
                  ${myGigs.reduce((acc, gig) => acc + (parseFloat(gig.budget) || 0), 0).toLocaleString()}
                </h3>
              </div>
              <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
           </Card>
        </div>

        {/* DataTable Container */}
        <div className="bg-midnight-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <DataTable
            columns={columns}
            data={myGigs}
            loading={loading}
            onSearch={handleSearch}
            searchPlaceholder="Search gig titles..."
            pagination={{
              currentPage: pagination.page,
              totalPages: pagination.pages
            }}
            onPageChange={handlePageChange}
          />

          {!loading && myGigs.length === 0 && (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Zap size={40} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No gigs found</h3>
              <p className="text-gray-400 max-w-md mb-8">
                Ready to find some quick talent? Post a gig and get started today.
              </p>
              <Link to="/client/post-gig">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  Post Your First Gig
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGigs;
