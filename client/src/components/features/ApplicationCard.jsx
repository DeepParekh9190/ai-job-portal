import React from 'react';
import Card from '../common/Card';
import { getRelativeTime } from '../../utils/helpers';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicationCard = ({ application }) => {
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'interview': return 'text-electric-purple bg-electric-purple/10 border-electric-purple/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'hired': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'offer': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  return (
    <Card className="hover:border-white/20 group">
      <Link to={`/user/applications/${application._id}`} className="flex items-center gap-4">
        {/* Company Logo */}
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">
          {application.job?.client?.company?.name?.charAt(0) || 'A'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate group-hover:text-electric-purple transition-colors">
            {application.job?.title || 'Unknown Position'}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {application.job?.client?.company?.name || 'Unknown Company'}
          </p>
        </div>

        {/* Status & Date */}
        <div className="flex flex-col items-end gap-2 text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
          <span className="text-xs text-gray-500">
            Applied {getRelativeTime(application.createdAt)}
          </span>
        </div>

        <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
      </Link>
    </Card>
  );
};

export default ApplicationCard;
