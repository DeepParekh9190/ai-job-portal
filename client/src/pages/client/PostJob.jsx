import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { createJob } from '../../redux/slices/jobSlice'; // Ensure this action exists
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Plus, X, ArrowLeft, CheckCircle } from 'lucide-react';

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.jobs);
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      requirements: { skills: [''] }, // Initial skill input
      status: 'active'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements.skills"
  });

  const onSubmit = async (data) => {
    try {
      // Clean up empty skills
      const cleanedSkills = data.requirements.skills.filter(s => s.trim() !== '');
      const jobData = {
        ...data,
        requirements: {
          ...data.requirements,
          skills: cleanedSkills
        }
      };
      
      await dispatch(createJob(jobData)).unwrap();
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Failed to post job:', err);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom max-w-3xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2" size={18} /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold font-display text-white">Post a New Job</h1>
          <p className="text-gray-400">Reach thousands of AI-ready talents.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-6">
            
            {/* Basic Info */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Basic Information</h3>
              
              <Input
                label="Job Title"
                placeholder="e.g. Senior React Developer"
                {...register('title', { required: 'Job title is required' })}
                error={errors.title?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-300">Job Type</label>
                   <select 
                     {...register('jobType')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple"
                   >
                     <option value="Full-time">Full-time</option>
                     <option value="Part-time">Part-time</option>
                     <option value="Contract">Contract</option>
                     <option value="Freelance">Freelance</option>
                     <option value="Internship">Internship</option>
                   </select>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-medium text-gray-300">Experience Level</label>
                   <select 
                     {...register('experienceLevel')}
                     className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple"
                   >
                     <option value="Entry">Entry Level</option>
                     <option value="Mid">Mid Level</option>
                     <option value="Senior">Senior Level</option>
                     <option value="Lead">Lead / Architect</option>
                     <option value="Manager">Manager</option>
                   </select>
                </div>
              </div>
            </section>

            {/* Location & Salary */}
            <section className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Location & Salary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                   label="City"
                   {...register('location.city', { required: 'City is required' })}
                   error={errors.location?.city?.message}
                 />
                 <Input
                   label="Country"
                   {...register('location.country', { required: 'Country is required' })}
                   error={errors.location?.country?.message}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input
                   label="Min Salary ($)"
                   type="number"
                   {...register('salary.min', { required: 'Min salary is required' })}
                   error={errors.salary?.min?.message}
                 />
                 <Input
                   label="Max Salary ($)"
                   type="number"
                   {...register('salary.max', { required: 'Max salary is required' })}
                   error={errors.salary?.max?.message}
                 />
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Description & Requirements</h3>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">Job Description</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={8}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple"
                  placeholder="Describe the role, responsibilities, and about the team..."
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Required Skills</label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        {...register(`requirements.skills.${index}`)}
                        placeholder="e.g. React.js"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="icon" 
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => append('')}
                    className="text-electric-purple"
                  >
                    <Plus size={16} className="mr-1" /> Add Skill
                  </Button>
                </div>
              </div>
            </section>

            <div className="pt-6 flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Post Job Now
              </Button>
            </div>

          </Card>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
