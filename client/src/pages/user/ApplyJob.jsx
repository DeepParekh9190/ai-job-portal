import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getJobById } from '../../redux/slices/jobSlice';
import { applyForJob } from '../../redux/slices/applicationSlice';
import { generateCoverLetter } from '../../redux/slices/aiSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  DollarSign, Calendar, Sparkles, Briefcase, 
  ChevronLeft, ArrowRight, Zap, Globe
} from 'lucide-react';
import { getMockJobById } from '../../data/mockJobs';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentJob, loading: jobLoading } = useSelector((state) => state.job);
  const { loading: submitting, error: submitError } = useSelector((state) => state.application);
  const { user } = useSelector((state) => state.auth);
  const { loading: generatingAI } = useSelector((state) => state.ai);
  
  // Support mock data for demo walkthroughs
  const [displayJob, setDisplayJob] = useState(() => getMockJobById(id));
  const [selectedResume, setSelectedResume] = useState('profile'); // 'profile' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [step, setStep] = useState(1);
  
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      expectedSalary: '',
      startDate: new Date().toISOString().split('T')[0],
      availabilityUnit: 'days',
      availabilityValue: '30'
    }
  });

  const coverLetterValue = watch('coverLetter');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Only fetch from API if it looks like a real database ID
    if (id && id.length >= 24) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Update displayJob if API returns data
    if (currentJob && (currentJob._id === id || currentJob.id === parseInt(id))) {
      setDisplayJob(currentJob);
    }
  }, [currentJob, id]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  const handleGenerateCoverLetter = async () => {
    if (!id || id.length < 24) {
      toast.error("AI Generation requires a live job listing");
      return;
    }
    
    try {
      const resultAction = await dispatch(generateCoverLetter(id));
      if (generateCoverLetter.fulfilled.match(resultAction)) {
        setValue('coverLetter', resultAction.payload.coverLetter);
        toast.success("AI Cover Letter Generated!");
      }
    } catch (err) {
      toast.error("Failed to generate cover letter");
    }
  };

  const onSubmit = async (data) => {
    try {
      // If mock, just show success and redirect
      if (!id || id.length < 24) {
        toast.success("Demo Application Submitted!");
        navigate('/user/applications');
        return;
      }
      
      const applicationPayload = {
        jobId: id,
        coverLetter: data.coverLetter,
        expectedSalary: {
          amount: parseInt(data.expectedSalary) || 0,
          currency: 'INR',
          period: 'yearly'
        },
        availability: {
          startDate: data.startDate,
          noticePeriod: {
            value: parseInt(data.availabilityValue) || 30,
            unit: data.availabilityUnit || 'days'
          }
        },
        linkedin: data.linkedin,
        // resumeId is optional if use profile
        resumeId: selectedResume === 'profile' ? null : data.resumeId 
      };

      await dispatch(applyForJob({ 
        jobId: id, 
        applicationData: applicationPayload 
      })).unwrap();
      navigate('/user/applications');
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  if ((jobLoading && !displayJob) || !displayJob) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-28 pb-20">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Career Opportunity
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
               {/* Background Glow */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-electric-purple/10 blur-[100px] rounded-full pointer-events-none"></div>
               
               <header className="relative z-10 mb-10">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-purple to-indigo-600 flex items-center justify-center shadow-lg shadow-electric-purple/20">
                     <Zap className="w-6 h-6 text-white" />
                   </div>
                   <div>
                     <h1 className="text-3xl font-bold font-display text-white">Express Your Interest</h1>
                     <p className="text-gray-400">Join the team at {displayJob.client?.company?.name}</p>
                   </div>
                 </div>

                 {/* Stepper */}
                 <div className="flex items-center gap-2 mt-8">
                   {[1, 2].map((s) => (
                     <React.Fragment key={s}>
                       <div 
                         className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-12 bg-electric-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'w-6 bg-white/10'}`}
                       ></div>
                       {s < 2 && <div className="text-gray-600 text-[10px] uppercase font-bold tracking-widest px-1">Round {s}</div>}
                     </React.Fragment>
                   ))}
                 </div>
               </header>

               <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
                 {step === 1 ? (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {/* Section 1: Personal */}
                     <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-electric-purple" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            label="Full Name"
                            placeholder="John Doe"
                            {...register('name', { required: 'Name is required' })}
                            error={errors.name?.message}
                          />
                          <Input
                            label="Contact Number"
                            placeholder="+91 00000 00000"
                            {...register('phone', { required: 'Phone is required' })}
                            error={errors.phone?.message}
                          />
                          <Input
                            label="Email Address"
                            readOnly
                            {...register('email')}
                            className="bg-white/5 opacity-60"
                          />
                          <Input
                            label="LinkedIn Profile"
                            placeholder="https://linkedin.com/in/username"
                            {...register('linkedin')}
                          />
                        </div>
                     </div>

                     {/* Section 2: Compensation & Availability */}
                     <div className="border-t border-white/5 pt-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-electric-purple" />
                          Logistics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Expected Annual Salary (INR)</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="number"
                                placeholder="e.g. 1500000"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all outline-none"
                                {...register('expectedSalary', { required: 'Salary expectation is required' })}
                              />
                            </div>
                            {errors.expectedSalary && <p className="text-xs text-red-400 mt-1">{errors.expectedSalary.message}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Earliest Start Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <input
                                type="date"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all outline-none"
                                {...register('startDate', { required: 'Start date is required' })}
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Notice Period</label>
                            <div className="flex gap-4">
                              <input
                                type="number"
                                className="w-24 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-electric-purple transition-all outline-none text-center"
                                {...register('availabilityValue')}
                              />
                              <select 
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-electric-purple outline-none"
                                {...register('availabilityUnit')}
                              >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                              </select>
                            </div>
                          </div>
                        </div>
                     </div>

                     <div className="pt-4 flex justify-end">
                       <Button 
                         type="button" 
                         onClick={async () => {
                           const isValid = await trigger(['name', 'phone', 'expectedSalary', 'startDate']);
                           if (isValid) {
                             setStep(2);
                           } else {
                             toast.error("Validation Error: Please check all required fields");
                           }
                         }}
                         className="px-10 py-4 group"
                       >
                         Next Step
                         <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {/* Step 2: Resume & Cover Letter */}
                     <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-electric-purple" />
                          Supporting Documents
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          <div 
                            onClick={() => setSelectedResume('profile')}
                            className={`cursor-pointer border rounded-2xl p-6 transition-all relative overflow-hidden group ${selectedResume === 'profile' ? 'bg-electric-purple/10 border-electric-purple shadow-lg shadow-electric-purple/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                            {selectedResume === 'profile' && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-electric-purple" />
                              </div>
                            )}
                            <FileText className={`w-8 h-8 mb-4 ${selectedResume === 'profile' ? 'text-electric-purple' : 'text-gray-500'}`} />
                            <h4 className="font-bold text-white mb-1">Use AI Profile</h4>
                            <p className="text-xs text-gray-400">Best results: Automatically optimized for this job.</p>
                          </div>

                          <div 
                            onClick={() => setSelectedResume('upload')}
                            className={`cursor-pointer border rounded-2xl p-6 transition-all relative overflow-hidden group ${selectedResume === 'upload' ? 'bg-electric-purple/10 border-electric-purple shadow-lg shadow-electric-purple/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                          >
                            {selectedResume === 'upload' && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-electric-purple" />
                              </div>
                            )}
                            <Upload className={`w-8 h-8 mb-4 ${selectedResume === 'upload' ? 'text-electric-purple' : 'text-gray-500'}`} />
                            <h4 className="font-bold text-white mb-1">Upload Resume</h4>
                            <p className="text-xs text-gray-400">PDF or Word preferred. Max 10MB.</p>
                          </div>
                        </div>

                        {selectedResume === 'upload' && (
                          <label className="block border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-electric-purple/30 transition-all bg-white/5 mb-8 cursor-pointer group">
                            <Upload className={`mx-auto h-10 w-10 mb-4 transition-colors ${selectedFile ? 'text-electric-purple' : 'text-gray-600 group-hover:text-electric-purple/80'}`} />
                            {selectedFile ? (
                              <div>
                                <p className="text-electric-purple font-bold mb-1">Resume Attached</p>
                                <p className="text-gray-400 text-sm">{selectedFile.name}</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-gray-300 font-medium">Drop your file here or click to browse</p>
                                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSelectedFile(e.target.files[0]);
                                }
                              }} 
                            />
                          </label>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-300">Cover Letter</label>
                            <button 
                              type="button"
                              disabled={generatingAI}
                              onClick={handleGenerateCoverLetter}
                              className="text-xs font-bold text-electric-purple hover:text-indigo-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-purple/10 border border-electric-purple/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                              {generatingAI ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  AI Drafting...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  AI Auto-Write
                                </>
                              )}
                            </button>
                          </div>
                          <textarea
                            {...register('coverLetter', { required: 'Cover letter is required' })}
                            rows={8}
                            placeholder="Tell us why you're a standout candidate..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all resize-none font-sans leading-relaxed"
                          />
                          {errors.coverLetter && <p className="text-xs text-red-400">{errors.coverLetter.message}</p>}
                        </div>
                     </div>

                     {submitError && (
                       <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-shake">
                         <AlertCircle size={20} className="shrink-0" />
                         <span className="text-sm">{submitError}</span>
                       </div>
                     )}

                     <div className="flex items-center gap-4 pt-4">
                       <Button 
                         variant="secondary" 
                         type="button"
                         onClick={() => setStep(1)}
                         className="flex-1 py-4"
                       >
                         Go Back
                       </Button>
                       <Button 
                         type="submit" 
                         loading={submitting} 
                         disabled={submitting}
                         className="flex-[2] py-4 bg-gradient-to-r from-electric-purple to-indigo-600 border-none shadow-xl hover:shadow-electric-purple/20"
                       >
                         {submitting ? 'Applying Now...' : 'Submit Application'}
                       </Button>
                     </div>
                   </div>
                 )}
               </form>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
             <Card className="bg-gradient-to-br from-indigo-900/40 to-midnight-900 border-indigo-500/20">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-midnight-800 border border-white/5 flex items-center justify-center text-xl font-bold">
                   {displayJob.client?.company?.name?.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-white line-clamp-1">{displayJob.title}</h4>
                   <p className="text-xs text-gray-500">{displayJob.client?.company?.name}</p>
                 </div>
               </div>
               
               <div className="space-y-4 py-4 border-y border-white/5 mb-6">
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center gap-2"><Globe className="w-4 h-4" /> Location</span>
                   <span className="text-white font-medium">{displayJob.location?.city}, {displayJob.location?.country}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Type</span>
                   <span className="text-white font-medium capitalize">{displayJob.jobType}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Salary</span>
                   <span className="text-white font-medium">{formatSalary(displayJob.salary?.min, displayJob.salary?.max)}</span>
                 </div>
               </div>

               <div className="p-4 bg-white/5 rounded-2xl">
                 <h5 className="text-[10px] font-bold text-electric-purple uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Zap className="w-3 h-3" /> Talentora Tip
                 </h5>
                 <p className="text-xs text-gray-400 leading-relaxed">
                   Applicants who use their AI Profile usually see a 40% higher response rate.
                 </p>
               </div>
             </Card>

             <div className="p-6 border border-white/10 rounded-3xl bg-white/5">
                <h4 className="font-bold text-white mb-4">Application Help</h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] text-green-500 font-bold shrink-0">1</div>
                    <p className="text-xs text-gray-400">Ensure your contact information is up to date.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] text-green-500 font-bold shrink-0">2</div>
                    <p className="text-xs text-gray-400">Use the AI Auto-Write tool to draft a personalized cover letter.</p>
                  </div>
                </div>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default ApplyJob;

