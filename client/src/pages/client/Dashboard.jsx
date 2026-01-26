import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyJobs } from '../../redux/slices/jobSlice';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Plus, Users, Briefcase, TrendingUp, MoreVertical, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatSalary, getRelativeTime } from '../../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data
const statsData = [
  { name: 'Mon', views: 24, applications: 4 },
  { name: 'Tue', views: 45, applications: 8 },
  { name: 'Wed', views: 32, applications: 6 },
  { name: 'Thu', views: 55, applications: 12 },
  { name: 'Fri', views: 68, applications: 15 },
  { name: 'Sat', views: 40, applications: 7 },
  { name: 'Sun', views: 35, applications: 5 },
];

const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myJobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const stats = [
    { title: 'Active Jobs', value: myJobs?.length || 0, icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
    { title: 'Total Applicants', value: '142', icon: <Users className="w-5 h-5 text-electric-purple" /> }, // Mock
    { title: 'Profile Views', value: '1,240', icon: <Eye className="w-5 h-5 text-green-400" /> }, // Mock
    { title: 'Hired', value: '12', icon: <TrendingUp className="w-5 h-5 text-gold" /> }, // Mock
  ];

  if (loading && !myJobs) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-midnight-900 pt-24 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-white mb-2">Employer Dashboard</h1>
            <p className="text-gray-400">Manage your jobs and applicants</p>
          </div>
          <Link to="/client/post-job">
            <Button>
              <Plus className="mr-2" size={18} /> Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-5 flex flex-col justify-between hover:border-white/20">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-midnight-800 rounded-lg">
                  {stat.icon}
                </div>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-400">{stat.title}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <h3 className="font-bold text-white mb-6">Views & Applications</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={statsData}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="applications" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
             <Card className="h-full">
               <h3 className="font-bold text-white mb-6">Recent Activity</h3>
               <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                 {[
                   { text: 'New application for "Senior React Dev"', time: '2 mins ago', type: 'app' },
                   { text: 'Job "UX Designer" was approved', time: '2 hours ago', type: 'system' },
                   { text: 'Interview scheduled with John Doe', time: '5 hours ago', type: 'interview' }
                 ].map((item, i) => (
                   <div key={i} className="pl-8 relative bg-transparent">
                      <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-midnight-900 ${
                        item.type === 'app' ? 'bg-electric-purple' : 
                        item.type === 'interview' ? 'bg-gold' : 'bg-green-400'
                      }`}></div>
                      <p className="text-sm text-gray-300 mb-1">{item.text}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                   </div>
                 ))}
               </div>
             </Card>
          </div>
        </div>

        {/* Recent Jobs Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-white">Your Active Jobs</h2>
             <Link to="/client/jobs" className="text-electric-purple text-sm hover:underline">View All</Link>
          </div>
          
          <div className="bg-midnight-800 border border-white/10 rounded-2xl overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                   <th className="p-4 text-xs font-semibold uppercase text-gray-400">Job Title</th>
                   <th className="p-4 text-xs font-semibold uppercase text-gray-400">Applications</th>
                   <th className="p-4 text-xs font-semibold uppercase text-gray-400">Status</th>
                   <th className="p-4 text-xs font-semibold uppercase text-gray-400">Posted Date</th>
                   <th className="p-4 text-xs font-semibold uppercase text-gray-400 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/10">
                 {myJobs?.slice(0, 5).map((job) => (
                   <tr key={job._id} className="hover:bg-white/5 transition-colors">
                     <td className="p-4">
                       <div className="font-medium text-white">{job.title}</div>
                       <div className="text-xs text-gray-500">{job.jobType} • {job.location?.city}</div>
                     </td>
                     <td className="p-4">
                       <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-6 h-6 rounded-full bg-white/20 border border-midnight-900"></div>
                         ))}
                         <div className="w-6 h-6 rounded-full bg-midnight-900 border border-white/20 flex items-center justify-center text-[10px] text-gray-400">+5</div>
                       </div>
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded-full text-xs border ${
                         job.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                       }`}>
                         {job.status}
                       </span>
                     </td>
                     <td className="p-4 text-sm text-gray-400">
                       {getRelativeTime(job.createdAt)}
                     </td>
                     <td className="p-4 text-right">
                       <Link to={`/client/jobs/${job._id}/applicants`}>
                         <Button variant="ghost" size="sm">Manage</Button>
                       </Link>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             {(!myJobs || myJobs.length === 0) && (
                <div className="p-12 text-center text-gray-500">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                  <p>You haven't posted any jobs yet.</p>
                  <Link to="/client/post-job">
                    <Button variant="link" className="mt-2 text-electric-purple">Post your first job</Button>
                  </Link>
                </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
