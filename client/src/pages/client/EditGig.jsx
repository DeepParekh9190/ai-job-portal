import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getGigById, updateGig, clearCurrentGig } from '../../redux/slices/jobSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { 
  Zap, 
  ArrowLeft, 
  Target, 
  DollarSign, 
  Save,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditGig = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentGig, loading } = useSelector((state) => state.job);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(getGigById(id));
    return () => dispatch(clearCurrentGig());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentGig) {
      reset({
        title: currentGig.title,
        description: currentGig.description,
        category: currentGig.category,
        duration: currentGig.duration,
        budget: currentGig.budget,
        deadline: currentGig.deadline ? new Date(currentGig.deadline).toISOString().split('T')[0] : '',
        status: currentGig.status
      });
    }
  }, [currentGig, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateGig({ id, gigData: data })).unwrap();
      navigate('/client/gigs');
    } catch (err) {
      // error handled in slice
    }
  };

  if (loading && !currentGig) return <Loader fullScreen />;

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
            EDIT <span className="text-indigo-400">GIG</span> LISTING
          </h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto">
            Modify your project scope and budget details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="bg-midnight-800/50 backdrop-blur-xl border border-white/10 p-8 space-y-8">
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
                  {...register('title', { required: 'Gig title is required' })}
                  error={errors.title?.message}
                  className="bg-white/5 border-white/10 text-white"
                />

                <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                   <textarea
                     {...register('description', { required: 'Description is required' })}
                     rows={6}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-sans"
                   ></textarea>
                   {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 block">Category</label>
                      <select 
                        {...register('category', { required: 'Category is required' })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                      >
                        <option value="Design" className="bg-midnight-900 border-none">Design</option>
                        <option value="Development" className="bg-midnight-900 border-none">Development</option>
                        <option value="Writing" className="bg-midnight-900 border-none">Writing</option>
                        <option value="Marketing" className="bg-midnight-900 border-none">Marketing</option>
                        <option value="AI Training" className="bg-midnight-900 border-none">AI Training</option>
                      </select>
                   </div>
                   
                   <Input
                     label="Duration"
                     {...register('duration')}
                     className="bg-white/5 border-white/10 text-white"
                   />
                </div>
              </div>
            </section>

            <div className="h-px bg-white/5"></div>

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
                  {...register('budget', { required: 'Budget is required' })}
                  error={errors.budget?.message}
                  className="bg-white/5 border-white/10 text-white"
                />
                
                <Input
                  label="Deadline"
                  type="date"
                  {...register('deadline')}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </section>

            <div className="pt-6 flex gap-4">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="px-8 rounded-2xl border border-white/10">
                CANCEL
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                className="flex-grow h-14 rounded-2xl bg-indigo-600 border-none font-black text-lg tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} /> UPDATE GIG
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default EditGig;
