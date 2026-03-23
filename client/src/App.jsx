import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// Layout Components
import AIChatSupport from './components/ui/AIChatSupport';
import Preloader from './components/ui/Preloader';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import BrowseJobs from './pages/user/BrowseJobs';
import BrowseGigs from './pages/user/BrowseGigs';
import JobDetails from './pages/user/JobDetails';
import ApplyJob from './pages/user/ApplyJob';
import MyApplications from './pages/user/MyApplications';
import ResumeBuilder from './pages/user/ResumeBuilder';
import ResumeAnalyzer from './pages/user/ResumeAnalyzer';
import Profile from './pages/user/Profile';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import PostJob from './pages/client/PostJob';
import PostGig from './pages/client/PostGig';
import MyJobs from './pages/client/MyJobs';
import MyGigs from './pages/client/MyGigs';
import Applicants from './pages/client/Applicants';
import EditJob from './pages/client/EditJob';
import EditGig from './pages/client/EditGig';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageClients from './pages/admin/ManageClients';
import ApproveJobs from './pages/admin/ApproveJobs';
import Analytics from './pages/admin/Analytics';

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.auth);
  
  // Global Preloader Logic
  const location = useLocation();
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const authWasHappening = useRef(false);

  // Show premium animation specifically during login/register transitions
  useEffect(() => {
    if (loading) {
      setIsAuthProcessing(true);
      authWasHappening.current = true;
    } else if (isAuthProcessing) {
      // Only set a timer to hide if we were actually processing
      const timer = setTimeout(() => {
        setIsAuthProcessing(false);
        setTimeout(() => {
          authWasHappening.current = false;
        }, 300); 
      }, 600); // Reduced drastically from 1500ms for snappier experience
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthProcessing]);

  // Handle route change preloader (only for main pages, not during auth)
  useEffect(() => {
    // Only show text preloader on normal navigation
    // AND only if we didn't just come from an auth animation
    if (!loading && !isAuthProcessing && !authWasHappening.current) {
      // Only trigger if navigation takes more than 100ms
      const timer = setTimeout(() => setIsPreloaderVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, loading, isAuthProcessing]);

  // Load user on app mount if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  // Global WebSocket Listener for Admin Broadcasts
  useEffect(() => {
    // ONLY connect to socket in development to avoid console errors in Vercel
    if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_ENABLE_SOCKETS) {
      console.log('📡 Socket matching is disabled in production (Vercel serverless mode).');
      return;
    }

    // Use the same origin for sockets in production or fallback to localhost
    const socketUrl = import.meta.env.MODE === 'production' 
      ? window.location.origin 
      : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
    
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    if (user && user.role) {
      socket.emit('join_role_room', user.role);
    } else {
      socket.emit('join_role_room', 'all');
    }

    socket.on('global_broadcast', (data) => {
      // Different styles based on target audience
      let icon = '📢';
      let bgColor = '#1e1b4b'; // Default dark purple
      let textColor = '#fff';
      let border = '1px solid #4f46e5'; // Indigo

      if (data.type === 'client_alert') {
        icon = '🏢';
        bgColor = '#422006'; // Dark amber/gold
        border = '1px solid #d97706';
      } else if (data.type === 'freelancer_alert') {
        icon = '🚀';
        bgColor = '#082f49'; // Dark blue
        border = '1px solid #0284c7';
      }

      toast.custom(
        (t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[#0c0a1a] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-white/10`} style={{ border }}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5 text-2xl">
                   {icon}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-black text-white uppercase tracking-widest">
                    SYSTEM BROADCAST
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    {data.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-white/10">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-electric-purple hover:text-white hover:bg-white/5 focus:outline-none transition-colors uppercase tracking-widest"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 10000, position: 'top-center' }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (isAuthProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#030305] text-white overflow-hidden relative">
        {/* Background Data Stream Effect */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold to-transparent animate-data-stream"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Central Convergence Core */}
          <div className="relative flex items-center justify-center w-40 h-40">
            {/* Outer Hexagon/Pulse */}
            <div className="absolute inset-0 border-[1px] border-electric-purple/30 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-spin-slow"></div>
            <div className="absolute inset-4 border-[1px] border-gold/20 rounded-[70%_30%_30%_70%/70%_70%_30%_30%] animate-reverse-spin"></div>
            
            {/* Scanning Line */}
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent animate-scan shadow-[0_0_15px_rgba(255,191,0,0.5)]"></div>

            {/* Inner Core */}
            <div className="relative w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center overflow-hidden rotate-45 group hover:scale-110 transition-transform duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-electric-purple via-indigo-600 to-gold opacity-40 animate-pulse"></div>
               <div className="relative -rotate-45 text-2xl font-black text-white drop-shadow-lg">T</div>
            </div>

            {/* Orbiting Satellites */}
            <div className="absolute w-2 h-2 bg-electric-purple rounded-full shadow-[0_0_10px_#a855f7] animate-orbit"></div>
            <div className="absolute w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_#fbbf24] animate-orbit" style={{ animationDelay: '-2s' }}></div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black tracking-[0.4em] font-display flex items-center justify-center">
              <span className="text-white">TALENTORA</span>
              <span className="ml-4 text-gold animate-flicker">AI</span>
            </h2>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-purple to-transparent animate-shimmer"></div>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.8em] text-gray-400 animate-pulse">
                Synchronizing Industry DNA
              </p>
            </div>
          </div>
        </div>

        {/* Floating Code Snippets Silhouette */}
        <div className="absolute bottom-10 right-10 text-[8px] font-mono text-electric-purple/10 pointer-events-none hidden lg:block">
          <pre>{`
            function synchronize() {
              const dna = talents.map(t => t.skills);
              return match(dna, opportunities);
            }
          `}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isPreloaderVisible && <Preloader onComplete={() => setIsPreloaderVisible(false)} />}
      <Navbar />
      <AIChatSupport />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/gigs" element={<BrowseGigs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/jobs/:id/apply"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ApplyJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/applications"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/resume-builder"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/resume-analyzer"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ResumeAnalyzer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'client']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/client/profile"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/post-job"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/post-gig"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <PostGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/jobs"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/gigs"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <MyGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/jobs/:id/applicants"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <EditJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/gigs/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <EditGig />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageClients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ApproveJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;