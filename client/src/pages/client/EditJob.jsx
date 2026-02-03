import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { getJobById, updateJob, clearCurrentJob } from '../../redux/slices/jobSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  Plus, 
  X, 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  Gem,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, loading } = useSelector((state) => state.job);
  
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      requirements: { skills: [''] },
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements.skills"
  });

  useEffect(() => {
    dispatch(getJobById(id));
    return () => dispatch(clearCurrentJob());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentJob) {
      reset({
        title: currentJob.title,
        jobType: currentJob.jobType,
        experienceLevel: currentJob.experienceLevel,
        location: {
          city: currentJob.location?.city,
          country: currentJob.location?.country
        },
        salary: {
          min: currentJob.salary?.min,
          max: currentJob.salary?.max
        },
        description: currentJob.description,
        requirements: {
          skills: currentJob.requirements?.skills?.length > 0 
            ? currentJob.requirements.skills 
            : ['']
        },
        status: currentJob.status
      });
    }
  }, [currentJob, reset]);

  const onSubmit = async (data) => {
    try {
      const cleanedSkills = data.requirements.skills.filter(s => s.trim() !== '');
      const jobData = {
        ...data,
        requirements: {
          ...data.requirements,
          skills: cleanedSkills
        }
      };
      
      await dispatch(updateJob({ id, jobData })).unwrap();
      navigate('/client/jobs');
    } catch (err) {
      // toast.error is handled in slice
    }
  };

  if (loading && !currentJob) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#030305] pt-24 pb-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden md:inline font-medium">Back</span>
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 text-gold mb-6 border border-gold/20">
            <Briefcase size={32} />
          </div>
          <h1 className="text-4xl font-black font-display text-white tracking-tight">
            EDIT <span className="text-gold">JOB</span> LISTING
          </h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto">
            Update your job details and technical requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-8 space-y-10">
            
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-electric-purple/20 flex items-center justify-center text-electric-purple">
                  <FileText size={18} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Main Information</h3>
              </div>
              
              <Input
                label="Job Title"
                {...register('title', { required: 'Job title is required' })}
                error={errors.title?.message}
                className="bg-white/5 border-white/10 text-white"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Job Type</label>
                   <select 
                     {...register('jobType')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold appearance-none"
                   >
                     <option value="Full-time" className="bg-midnight-900">Full-time</option>
                     <option value="Part-time" className="bg-midnight-900">Part-time</option>
                     <option value="Contract" className="bg-midnight-900">Contract</option>
                     <option value="Freelance" className="bg-midnight-900">Freelance</option>
                     <option value="Internship" className="bg-midnight-900">Internship</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Experience Level</label>
                   <select 
                     {...register('experienceLevel')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold appearance-none"
                   >
                     <option value="Entry" className="bg-midnight-900">Entry Level</option>
                     <option value="Mid" className="bg-midnight-900">Mid Level</option>
                     <option value="Senior" className="bg-midnight-900">Senior Level</option>
                     <option value="Lead" className="bg-midnight-900">Lead / Architect</option>
                     <option value="Manager" className="bg-midnight-900">Manager</option>
                   </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                  <MapPin size={18} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Location & Compensation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="City"
                   {...register('location.city', { required: 'City is required' })}
                   error={errors.location?.city?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
                 <Input
                   label="Country"
                   {...register('location.country', { required: 'Country is required' })}
                   error={errors.location?.country?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input
                   label="Min Salary ($)"
                   type="number"
                   {...register('salary.min', { required: 'Min salary is required' })}
                   error={errors.salary?.min?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
                 <Input
                   label="Max Salary ($)"
                   type="number"
                   {...register('salary.max', { required: 'Max salary is required' })}
                   error={errors.salary?.max?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
                  <Gem size={18} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Detailed Profile</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Job Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-gold transition-all"
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Required Skills</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...register(`requirements.skills.${index}`)}
                        placeholder="e.g. React.js"
                        className="bg-white/5 border-white/10 text-white"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="rounded-xl border border-white/10 hover:bg-red-500/20 hover:text-red-400 shrink-0"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => append('')}
                  className="text-gold bg-gold/5 border border-gold/20 hover:bg-gold/10 px-6 py-4 rounded-xl"
                >
                  <Plus size={16} className="mr-2" /> ADD SKILL
                </Button>
              </div>
            </section>

            <div className="pt-10 flex gap-4">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="flex-shrink-0 px-8 rounded-2xl border border-white/10"
              >
                CANCEL
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                className="flex-grow h-14 rounded-2xl bg-gold text-midnight-900 border-none font-black text-lg tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> SAVE CHANGES
              </Button>
            </div>

          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
