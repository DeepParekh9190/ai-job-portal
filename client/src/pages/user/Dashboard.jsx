import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Briefcase, Bookmark, Settings, 
  MapPin, Clock, DollarSign, ChevronRight, TrendingUp, 
  CheckCircle, XCircle, AlertCircle, Calendar, Upload, Zap, User
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for Charts
const activityData = [
  { name: 'Mon', views: 4, applications: 2 },
  { name: 'Tue', views: 7, applications: 1 },
  { name: 'Wed', views: 5, applications: 3 },
  { name: 'Thu', views: 8, applications: 5 },
  { name: 'Fri', views: 12, applications: 4 },
  { name: 'Sat', views: 9, applications: 2 },
  { name: 'Sun', views: 6, applications: 1 },
];

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigation = (id) => {
    setActiveTab(id);
    if (id === 'resume') navigate('/user/resume-builder');
    if (id === 'profile') navigate('/user/profile');
    if (id === 'applications') navigate('/user/applications');
    // Add other routes as needed
  };

  // Mock Stats
  const stats = [
    { title: 'Total Applications', value: '12', icon: <Briefcase className="w-5 h-5 text-blue-400" />, change: '+2 this week' },
    { title: 'Interviews Scheduled', value: '3', icon: <Calendar className="w-5 h-5 text-electric-purple" />, change: '1 upcoming' },
    { title: 'Profile Views', value: '48', icon: <TrendingUp className="w-5 h-5 text-green-400" />, change: '+12% vs last week' },
    { title: 'Saved Jobs', value: '8', icon: <Bookmark className="w-5 h-5 text-gold" />, change: 'Saved recently' },
  ];

  return (
    <div className="min-h-screen bg-midnight-900 pt-20 pb-12">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-purple to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-electric-purple/20">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-white truncate max-w-[120px]">{user?.name || 'User'}</h3>
                  <p className="text-xs text-gray-400">Candidate</p>
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                  { id: 'applications', label: 'My Applications', icon: FileText },
                  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
                  { id: 'resume', label: 'AI Resume Builder', icon: Upload },
                  { id: 'profile', label: 'My Profile', icon: User },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id 
                        ? 'bg-electric-purple text-white shadow-lg shadow-electric-purple/20' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="bg-gradient-to-br from-electric-purple/20 to-indigo-600/20 border border-electric-purple/30 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Resume Score</h4>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-electric-purple">85</span>
                    <span className="text-xs text-gray-400 mb-1">/100</span>
                  </div>
                  <div className="w-full bg-midnight-900 rounded-full h-1.5 mb-2">
                    <div className="bg-electric-purple h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400">Your profile is looking great!</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8">
            
            {/* Header & Stats Grid */}
            <div>
              <h1 className="text-2xl font-bold font-display mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-gray-400 mb-8">Here's what's happening with your job search today.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-midnight-800 rounded-lg group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts & Recommended Jobs Split */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Activity Chart */}
              <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Application Activity</h2>
                  <select className="bg-midnight-800 border border-white/10 rounded-lg text-xs text-gray-400 px-3 py-1 outline-none focus:border-electric-purple">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7280" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e1c2e', borderColor: '#ffffff20', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Recent Applications ... */}


              {/* Recent Applications */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Recent Applications</h2>
                  <Link to="/user/applications" className="text-xs text-electric-purple hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                  {[
                    { company: 'TechFlow', role: 'Senior Frontend Dev', status: 'Interview', date: '2d ago' },
                    { company: 'InnovateAI', role: 'Product Designer', status: 'Pending', date: '5d ago' },
                    { company: 'DataSphere', role: 'Data Scientist', status: 'Rejected', date: '1w ago' },
                    { company: 'CloudMatrix', role: 'DevOps Engineer', status: 'Pending', date: '1w ago' },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg font-bold">
                        {app.company.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate text-white group-hover:text-electric-purple transition-colors">{app.role}</h4>
                        <p className="text-xs text-gray-400 truncate">{app.company}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-1 rounded-full border ${
                          app.status === 'Interview' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          app.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Jobs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recommended for You</h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                     <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                     <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-electric-purple/50 transition-colors group cursor-pointer relative overflow-visible">
                    <div className="absolute top-4 right-4">
                      <button className="text-gray-500 hover:text-gold transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-orange-500" />
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1 group-hover:text-electric-purple transition-colors">Senior React Developer</h3>
                    <p className="text-sm text-gray-400 mb-4">TechFlow • Remote</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300">React</span>
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300">Node.js</span>
                      <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300">TypeScript</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-sm font-medium text-white">$120k - $150k</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
