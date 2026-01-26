import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../../redux/slices/jobSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import MatchScore from '../../components/features/MatchScore';
import { MapPin, Briefcase, DollarSign, Clock, Building2, Calendar, CheckCircle } from 'lucide-react';
import { formatSalary, getRelativeTime, formatDate } from '../../utils/helpers';
import { calculateJobMatch } from '../../redux/slices/aiSlice';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentJob, loading: jobLoading, error } = useSelector((state) => state.jobs);
  const { matchScore, loading: matchLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    dispatch(getJobById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob) {
      dispatch(calculateJobMatch({ jobId: id }));
    }
  }, [dispatch, currentJob, id]);

  if (jobLoading || !currentJob) return <Loader fullScreen />;
  
  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500">Error Loading Job</h2>
        <p className="text-gray-400 mt-2">{error}</p>
        <Link to="/jobs">
          <Button variant="secondary" className="mt-4">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  const { title, description, requirements, salary, location, jobType, client, createdAt, applicants } = currentJob;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <Link to="/jobs" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">&larr; Back to Jobs</Link>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl font-bold text-white border border-white/10">
                {client?.company?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-white mb-2">{title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-400">
                  <span className="flex items-center gap-1"><Building2 size={16} /> {client?.company?.name}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {location?.city}, {location?.country}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> Posted {getRelativeTime(createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-electric-purple/10 text-electric-purple border border-electric-purple/20 text-sm font-medium flex items-center gap-2">
                <Briefcase size={14} /> {jobType}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-medium flex items-center gap-2">
                <DollarSign size={14} /> {formatSalary(salary?.min, salary?.max)}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium flex items-center gap-2">
                <Calendar size={14} /> Apply by {formatDate(new Date(Date.now() + 86400000 * 14))}
              </span>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <Card className="p-6 text-center">
              <h3 className="font-bold text-lg mb-4">Interested in this role?</h3>
              <Link to={`/user/jobs/${id}/apply`}>
                <Button className="w-full mb-3" size="lg">Apply Now</Button>
              </Link>
              <Button variant="secondary" className="w-full">Save Job</Button>
              <p className="text-xs text-gray-500 mt-4">{applicants?.length || 0} applicants have applied</p>
            </Card>

            {/* Match Score Widget */}
            <MatchScore 
              score={matchScore?.score || 0} 
              breakdown={matchScore?.breakdown} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">About the Job</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
              <div className="space-y-3">
                {requirements?.skills?.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-electric-purple" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

             {/* Responsibilities (Mock if missing from API) */}
             <section>
              <h2 className="text-xl font-bold text-white mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                <li>Unit-test code for robustness, including edge cases, usability, and general reliability.</li>
                <li>Work on bug fixing and improving application performance.</li>
                <li>Continuously discover, evaluate, and implement new technologies to maximize development efficiency.</li>
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-bold mb-4">Company Overview</h3>
              <p className="text-sm text-gray-400 mb-4">
                {client?.company?.description || "We are a leading technology company focused on innovation and digital transformation."}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Industry</span>
                  <span className="text-gray-300">{client?.company?.industry || 'Technology'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Website</span>
                  <a href={client?.company?.website} target="_blank" rel="noopener noreferrer" className="text-electric-purple hover:underline">Visit Website</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
