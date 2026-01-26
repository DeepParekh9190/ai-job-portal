import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerUser, clearError } from '../../redux/slices/authSlice';
import { Mail, Lock, User, Briefcase, ArrowRight, Loader, Building2 } from 'lucide-react';
import gsap from 'gsap';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'user'
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const formRef = useRef(null);
  
  const selectedRole = watch('role');

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/dashboard`;
      navigate(redirectPath);
    }

    gsap.fromTo(formRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );

    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const onSubmit = (data) => {
    // Ensure role is correctly set
    const userData = {
      ...data,
      role: data.role // 'user' or 'client'
    };
    dispatch(registerUser(userData));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden py-10">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-electric-purple/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div ref={formRef} className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-strong">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">Create Account</h1>
          <p className="text-gray-400">Join the future of hiring today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className={`cursor-pointer rounded-xl p-4 border transition-all ${selectedRole === 'user' ? 'bg-electric-purple/20 border-electric-purple' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <input 
                type="radio" 
                value="user" 
                {...register("role")} 
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <User className={`w-8 h-8 ${selectedRole === 'user' ? 'text-electric-purple' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedRole === 'user' ? 'text-white' : 'text-gray-400'}`}>Candidate</span>
              </div>
            </label>

            <label className={`cursor-pointer rounded-xl p-4 border transition-all ${selectedRole === 'client' ? 'bg-gold/20 border-gold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
              <input 
                type="radio" 
                value="client" 
                {...register("role")} 
                className="hidden" 
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <Building2 className={`w-8 h-8 ${selectedRole === 'client' ? 'text-gold' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedRole === 'client' ? 'text-white' : 'text-gray-400'}`}>Employer</span>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-electric-purple transition-colors" />
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
              />
            </div>
            {errors.name && <span className="text-xs text-red-400 ml-1">{errors.name.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-electric-purple transition-colors" />
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
              />
            </div>
            {errors.email && <span className="text-xs text-red-400 ml-1">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-electric-purple transition-colors" />
              <input
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                type="password"
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-electric-purple focus:ring-1 focus:ring-electric-purple transition-all"
              />
            </div>
            {errors.password && <span className="text-xs text-red-400 ml-1">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-electric-purple to-indigo-600 text-white rounded-xl py-4 font-bold text-lg hover:shadow-lg hover:shadow-electric-purple/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:text-electric-purple transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
