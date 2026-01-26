import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getJobById } from '../../redux/slices/jobSlice';
import { applyForJob } from '../../redux/slices/applicationSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJob, loading: jobLoading } = useSelector((state) => state.jobs);
  const { loading: submitting, error: submitError } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedResume, setSelectedResume] = useState('profile'); // 'profile' or 'upload'

  useEffect(() => {
    if (!currentJob || currentJob._id !== id) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id, currentJob]);

  const onSubmit = async (data) => {
    try {
      await dispatch(applyForJob({ jobId: id, ...data })).unwrap();
      navigate('/user/applications');
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  if (jobLoading || !currentJob) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Apply for {currentJob.title}</h1>
          <p className="text-gray-400">{currentJob.client?.company?.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      defaultValue={user?.name}
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Email"
                      defaultValue={user?.email}
                      {...register('email', { required: 'Email is required' })}
                      error={errors.email?.message}
                      readOnly
                      className="opacity-60 cursor-not-allowed"
                    />
                    <Input
                      label="Phone"
                      defaultValue={user?.phone}
                      {...register('phone', { required: 'Phone is required' })}
                      error={errors.phone?.message}
                    />
                    <Input
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/..."
                      {...register('linkedin')}
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-bold mb-4">Resume</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div 
                      onClick={() => setSelectedResume('profile')}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selectedResume === 'profile' ? 'bg-electric-purple/20 border-electric-purple' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <FileText className={selectedResume === 'profile' ? 'text-electric-purple' : 'text-gray-400'} />
                      <span className="text-sm font-medium">Use AI Profile Resume</span>
                    </div>
                    <div 
                      onClick={() => setSelectedResume('upload')}
                      className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${selectedResume === 'upload' ? 'bg-electric-purple/20 border-electric-purple' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <Upload className={selectedResume === 'upload' ? 'text-electric-purple' : 'text-gray-400'} />
                      <span className="text-sm font-medium">Upload New Resume</span>
                    </div>
                  </div>

                  {selectedResume === 'profile' && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1 shrink-0" size={16} />
                      <div>
                        <p className="text-sm text-green-200 font-medium">Using your AI Optimized Profile</p>
                        <p className="text-xs text-green-200/60 mt-1">We'll generate a tailored resume based on your profile and this job description.</p>
                      </div>
                    </div>
                  )}

                  {selectedResume === 'upload' && (
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-electric-purple/50 transition-colors bg-white/5">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
                      <input 
                        type="file" 
                        className="hidden" 
                        {...register('resumeFile', { required: selectedResume === 'upload' ? 'Resume file is required' : false })} 
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-bold mb-2">Cover Letter (Optional)</h3>
                  <textarea
                    {...register('coverLetter')}
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
                    placeholder="Why are you a good fit for this role?"
                  />
                  <div className="flex justify-end mt-2">
                    <Button type="button" variant="ghost" size="sm" className="text-xs">
                      ✨ Generate with AI
                    </Button>
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{submitError}</span>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button variant="secondary" onClick={() => navigate(-1)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" loading={submitting} className="flex-1">
                    Submit Application
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div>
             {/* Side Job Info */}
             <Card className="sticky top-24">
               {/* Job Summary */}
               <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">Job Summary</h4>
               <div className="space-y-4">
                 <div>
                   <span className="text-xs text-gray-500 block">Role</span>
                   <span className="font-medium text-white">{currentJob.title}</span>
                 </div>
                 <div>
                   <span className="text-xs text-gray-500 block">Company</span>
                   <span className="font-medium text-white">{currentJob.client?.company?.name}</span>
                 </div>
                 <div>
                   <span className="text-xs text-gray-500 block">Location</span>
                   <span className="font-medium text-white">{currentJob.location?.city}</span>
                 </div>
                 <div>
                   <span className="text-xs text-gray-500 block">Salary</span>
                   <span className="font-medium text-white">{formatSalary(currentJob.salary?.min, currentJob.salary?.max)}</span>
                 </div>
               </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;
