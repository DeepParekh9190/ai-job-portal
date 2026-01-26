import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications } from '../../redux/slices/applicationSlice';
import DataTable from '../../components/features/DataTable';
import Loader from '../../components/common/Loader';
import { getStatusColor, formatDate } from '../../utils/helpers';
import { Eye } from 'lucide-react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applications);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  const columns = [
    {
      header: 'Company',
      width: '25%',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs">
            {row.job?.client?.company?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="font-medium text-white">{row.job?.client?.company?.name || 'Unknown'}</div>
            <div className="text-xs text-gray-500">{row.job?.location?.city || 'Remote'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      width: '25%',
      render: (row) => (
        <Link to={`/jobs/${row.job?._id}`} className="hover:text-electric-purple transition-colors font-medium">
          {row.job?.title}
        </Link>
      )
    },
    {
      header: 'Applied Date',
      width: '15%',
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
      width: '10%',
      render: (row) => (
        <Link to={`/user/applications/${row._id}`}>
          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
            <Eye size={16} />
          </Button>
        </Link>
      )
    }
  ];

  const filteredApplications = applications.filter(app => 
    app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job?.client?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display text-white mb-2">My Applications</h1>
          <p className="text-gray-400">Track and manage your job applications</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredApplications}
            loading={loading}
            onSearch={setSearchTerm}
            searchPlaceholder="Search applications..."
            pagination={{
              currentPage: 1,
              totalPages: 1 // Implement proper pagination later
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyApplications;
