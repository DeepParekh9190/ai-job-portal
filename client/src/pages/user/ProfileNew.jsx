import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { updateProfile } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || 'San Francisco, CA',
      title: user?.professional?.title || 'Software Engineer',
      bio: user?.bio || 'Passionate developer with experience in building scalable web applications.'
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold font-display text-white mb-1">My Profile</h1>
              <p className="text-gray-400 text-sm">Manage your account settings and public profile</p>
            </div>
          </div>
          {!isEditing && (
             <Button onClick={() => setIsEditing(true)}>Edit Profile</Button> 
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Avatar & Basic Info */}
            <div className="md:col-span-1 space-y-6">
              <Card className="text-center">
                <div className="relative inline-block mb-4 group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-electric-purple/30 mx-auto bg-midnight-800">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-electric-purple/10 flex items-center justify-center text-4xl font-bold text-electric-purple">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-electric-purple text-white p-2 rounded-full cursor-pointer hover:bg-electric-purple-light transition-colors shadow-lg">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
                <p className="text-electric-purple text-sm mb-4 capitalize">{user?.role || 'Candidate'}</p>
                
                <div className="flex flex-col gap-2 text-sm text-gray-400 text-left mt-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Mail size={16} className="text-gray-500 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Phone size={16} className="text-gray-500 shrink-0" />
                    <span>{user?.phone || 'Add phone number'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <MapPin size={16} className="text-gray-500 shrink-0" />
                    <span>{user?.location || 'San Francisco, CA'}</span>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-white mb-4">Profile Strength</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-green-400">85%</span>
                  <span className="text-xs text-gray-400 mb-1">Excellent</span>
                </div>
                <div className="w-full bg-midnight-900 rounded-full h-2 mb-4">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <ul className="space-y-3 text-xs text-gray-400">
                  <li className="flex items-center gap-2 text-green-400 bg-green-400/5 p-2 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Email Verified
                  </li>
                  <li className="flex items-center gap-2 text-green-400 bg-green-400/5 p-2 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Profile Data Complete
                  </li>
                  <li className="flex items-center gap-2 text-gray-500 p-2 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div> Add Portfolio Link
                  </li>
                </ul>
              </Card>
            </div>

            {/* Right Column: Editable Fields */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                  <User className="text-electric-purple" size={20} />
                  <h3 className="text-lg font-bold text-white">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    disabled={!isEditing}
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                  />
                  <Input
                    label="Job Title"
                    placeholder="e.g. Senior Product Designer"
                    disabled={!isEditing}
                    {...register('title')}
                  />
                  <Input
                    label="Email Address"
                    disabled={true} 
                    {...register('email')}
                    className="opacity-50 cursor-not-allowed"
                  />
                  <Input
                    label="Phone Number"
                    disabled={!isEditing}
                    {...register('phone')}
                  />
                </div>
                
                <div className="mt-6">
                   <label className="text-sm font-medium text-gray-300 mb-1.5 block">Bio / Summary</label>
                   <textarea 
                     disabled={!isEditing}
                     {...register('bio')}
                     rows={4}
                     className={`w-full bg-white/5 border ${isEditing ? 'border-white/20 focus:border-electric-purple focus:ring-1 focus:ring-electric-purple' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none transition-all resize-none ${!isEditing ? 'opacity-70' : ''}`}
                     placeholder="Tell us about yourself..."
                   />
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
                  <Briefcase className="text-electric-purple" size={20} />
                  <h3 className="text-lg font-bold text-white">Professional Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Input
                      label="Current Company"
                      placeholder="e.g. Google"
                      disabled={!isEditing}
                   />
                   <Input
                      label="Website / Portfolio"
                      placeholder="https://..."
                      disabled={!isEditing}
                   />
                   <Input
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/..."
                      disabled={!isEditing}
                   />
                   <Input
                      label="GitHub URL"
                      placeholder="https://github.com/..."
                      disabled={!isEditing}
                   />
                </div>
              </Card>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setIsEditing(false)} type="button">
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    <Save size={18} className="mr-2" /> Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
