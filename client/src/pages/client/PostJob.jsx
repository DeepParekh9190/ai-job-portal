import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { createJob } from '../../redux/slices/jobSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { 
  Plus, 
  X, 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle,
  Gem
} from 'lucide-react';
import toast from 'react-hot-toast';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.job);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      requirements: { skills: [''] },
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements.skills"
  });

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
      
      await dispatch(createJob(jobData)).unwrap();
      toast.success('Job posted successfully! Awaiting admin approval.');
      navigate('/client/jobs');
    } catch (err) {
      // toast.error is handled in slice
    }
  };

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
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/20 text-gold mb-6 border border-gold/20 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
            <Briefcase size={32} />
          </div>
          <h1 className="text-4xl font-black font-display text-white tracking-tight">
            POST A NEW <span className="text-gold">JOB</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto">
            Find the world's best AI talent. Reach thousands of professionals across the globe.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-8 space-y-10">
            
            {/* section: Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-electric-purple/20 flex items-center justify-center text-electric-purple">
                  <FileText size={18} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">Main Information</h3>
              </div>
              
              <Input
                label="Job Title"
                placeholder="e.g. Senior Machine Learning Engineer"
                {...register('title', { required: 'Job title is required' })}
                error={errors.title?.message}
                className="bg-white/5 border-white/10 text-white"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Job Type</label>
                   <select 
                     {...register('jobType')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all appearance-none"
                   >
                     <option value="Full-time" className="bg-midnight-900 font-sans">Full-time</option>
                     <option value="Part-time" className="bg-midnight-900 font-sans">Part-time</option>
                     <option value="Contract" className="bg-midnight-900 font-sans">Contract</option>
                     <option value="Freelance" className="bg-midnight-900 font-sans">Freelance</option>
                     <option value="Internship" className="bg-midnight-900 font-sans">Internship</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Experience Level</label>
                   <select 
                     {...register('experienceLevel')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all appearance-none"
                   >
                     <option value="Entry" className="bg-midnight-900 font-sans">Entry Level</option>
                     <option value="Mid" className="bg-midnight-900 font-sans">Mid Level</option>
                     <option value="Senior" className="bg-midnight-900 font-sans">Senior Level</option>
                     <option value="Lead" className="bg-midnight-900 font-sans">Lead / Architect</option>
                     <option value="Manager" className="bg-midnight-900 font-sans">Manager</option>
                   </select>
                </div>
              </div>
            </section>

            {/* section: Geo & Compensation */}
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
                   placeholder="e.g. San Francisco"
                   {...register('location.city', { required: 'City is required' })}
                   error={errors.location?.city?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
                 <Input
                   label="Country"
                   placeholder="e.g. USA"
                   {...register('location.country', { required: 'Country is required' })}
                   error={errors.location?.country?.message}
                   className="bg-white/5 border-white/10 text-white"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                      <DollarSign size={14} className="text-gold" /> Min Salary ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 100000"
                      {...register('salary.min', { required: 'Min salary is required' })}
                      error={errors.salary?.min?.message}
                      className="bg-midnight-900/50 border-white/10 text-white"
                    />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block flex items-center gap-2">
                      <DollarSign size={14} className="text-gold" /> Max Salary ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 150000"
                      {...register('salary.max', { required: 'Max salary is required' })}
                      error={errors.salary?.max?.message}
                      className="bg-midnight-900/50 border-white/10 text-white"
                    />
                 </div>
              </div>
            </section>

            {/* section: Requirements */}
            <section className="space-y-6 pt-4">
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm leading-relaxed"
                  placeholder="Tell us about the role, the team, and what a typical day looks like..."
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Required Skills & DNA</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 group">
                      <div className="relative flex-grow">
                        <Input
                          {...register(`requirements.skills.${index}`)}
                          placeholder="e.g. PyTorch"
                          className="bg-white/5 border-white/10 text-white pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gold/30 flex items-center justify-center">
                          <span className="text-[10px] text-gold">{index + 1}</span>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="rounded-xl border border-white/10 hover:bg-red-500/20 hover:text-red-400 transition-all shrink-0"
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
                  <Plus size={16} className="mr-2" /> ADD SKILL REQUIREMENT
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
                className="flex-grow h-14 rounded-2xl bg-gradient-to-r from-gold via-gold-glow to-gold-glow text-midnight-900 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] border-none font-black text-lg tracking-widest transition-all"
              >
                LAUNCH JOB LISTING
              </Button>
            </div>

          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
