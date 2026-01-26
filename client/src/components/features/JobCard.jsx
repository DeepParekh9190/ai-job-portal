import React from 'react';
import { MapPin, Briefcase, DollarSign, Clock, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatSalary, getRelativeTime } from '../../utils/helpers';
import Card from '../common/Card';

const JobCard = ({ job, showMatchScore = false }) => {
  return (
    <Link to={`/jobs/${job._id}`} className="block h-full">
      <Card hover className="h-full flex flex-col relative group">
        {/* Match Score Badge */}
        {showMatchScore && job.matchScore && (
          <div className="absolute top-4 right-12 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-lg border border-white/10 z-10">
            <span className="text-sm font-bold text-electric-purple">{job.matchScore}% Match</span>
          </div>
        )}
        
        {/* Save Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            // Handle save logic
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gold transition-colors z-10"
        >
          <Bookmark size={20} />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-xl font-bold text-white border border-white/10">
            {job.client?.company?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-electric-purple transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-400">{job.client?.company?.name || 'Company Name'}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin size={16} className="text-gray-500" />
            <span>{job.location?.city || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Briefcase size={16} className="text-gray-500" />
            <span>{job.jobType}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign size={16} className="text-gray-500" />
            <span>{formatSalary(job.salary?.min, job.salary?.max)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.requirements?.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
              {skill}
            </span>
          ))}
          {job.requirements?.skills?.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
              +{job.requirements.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {getRelativeTime(job.createdAt)}
          </span>
          <span className="text-xs font-medium text-electric-purple group-hover:translate-x-1 transition-transform">
            View Details &rarr;
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default JobCard;
