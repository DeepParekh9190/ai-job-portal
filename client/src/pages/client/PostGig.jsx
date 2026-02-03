import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createGig } from '../../redux/slices/jobSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { 
  Zap, 
  ArrowLeft, 
  Target, 
  DollarSign, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const PostGig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.job);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      status: 'active'
    }
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(createGig(data)).unwrap();
      toast.success('Gig posted successfully!');
      navigate('/client/gigs');
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
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 border border-indigo-500/20">
            <Zap size={32} />
          </div>
          <h1 className="text-4xl font-black font-display text-white tracking-tight">
            POST A NEW <span className="text-indigo-400">GIG</span>
          </h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto">
            Find specialized talent for your short-term projects and specific tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-8">
              <div className="space-y-8">
                {/* section: Basic Info */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                       <Target size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Project Scope</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <Input
                      label="Gig Title"
                      placeholder="e.g. Design a futuristic landing page"
                      {...register('title', { required: 'Gig title is required' })}
                      error={errors.title?.message}
                      className="bg-white/5 border-white/10 text-white"
                    />

                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                       <textarea
                         {...register('description', { required: 'Description is required' })}
                         rows={6}
                         placeholder="Describe exactly what you need to be done..."
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                       ></textarea>
                       {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                          <select 
                            {...register('category', { required: 'Category is required' })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                          >
                            <option value="" className="bg-midnight-900">Select Category</option>
                            <option value="Design" className="bg-midnight-900">Design</option>
                            <option value="Development" className="bg-midnight-900">Development</option>
                            <option value="Writing" className="bg-midnight-900">Writing</option>
                            <option value="Marketing" className="bg-midnight-900">Marketing</option>
                            <option value="AI Training" className="bg-midnight-900">AI Training</option>
                          </select>
                          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                       </div>
                       
                       <Input
                         label="Duration"
                         placeholder="e.g. 3 Days, 1 Week"
                         {...register('duration')}
                         className="bg-white/5 border-white/10 text-white"
                       />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-white/5"></div>

                {/* section: Budget & Deadline */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                       <DollarSign size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Financials</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Budget ($)"
                      type="number"
                      placeholder="e.g. 500"
                      {...register('budget', { required: 'Budget is required' })}
                      error={errors.budget?.message}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    
                    <Input
                      label="Deadline (Optional)"
                      type="date"
                      {...register('deadline')}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </section>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="text-gray-500 hover:text-white">
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                className="px-10 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 border-none shadow-xl hover:shadow-indigo-500/20 transition-all font-bold text-lg"
              >
                PUBLISH GIG
              </Button>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6">
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <Sparkles size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">AI Optimizer</span>
              </div>
              <p className="text-sm text-gray-300 mb-4 italic">
                "We recommend setting a clear deadline to attract top freelancers 2x faster."
              </p>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex gap-3">
                 <Info size={16} className="text-indigo-400 shrink-0" />
                 <p className="text-xs text-gray-400 leading-relaxed">
                   Gigs are displayed immediately to our community of specialized freelancers.
                 </p>
              </div>
            </Card>

            <Card className="bg-midnight-800/50 border border-white/10 p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                Posting Guidelines
              </h4>
              <ul className="space-y-3">
                 {[
                   'Be specific about deliverables',
                   'Mention required tools/stack',
                   'Define clear milestones',
                   'Specify your timezone preference'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-2 text-xs text-gray-400">
                     <span className="text-indigo-500">•</span>
                     {text}
                   </li>
                 ))}
              </ul>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostGig;
