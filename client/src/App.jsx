import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';

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
import Profile from './pages/user/ProfileNew';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import PostJob from './pages/client/PostJob';
import PostGig from './pages/client/PostGig';
import MyJobs from './pages/client/MyJobs';
import MyGigs from './pages/client/MyGigs';
import Applicants from './pages/client/Applicants';

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
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [forcedLoading, setForcedLoading] = useState(true);

  useEffect(() => {
    // Show preloader on every route change
    setIsPreloaderVisible(true);
  }, [location.pathname]);

  // Minimum 3-second loading time for presentation feel
  useEffect(() => {
    const timer = setTimeout(() => {
      setForcedLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load user on app mount if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  if (loading || forcedLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-white overflow-hidden relative">
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-purple/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        
        <div className="relative flex flex-col items-center gap-6">
          {/* Animated rings */}
          <div className="relative w-20 h-20">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-electric-purple/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-electric-purple rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-4 border-gold/10 rounded-full"></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-4 border-b-gold rounded-full animate-spin-slow"></div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold tracking-widest bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent font-display animate-shimmer">
              TALENTORA AI
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-electric-purple rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-electric-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-electric-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
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