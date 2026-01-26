import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Settings, Briefcase, FileText } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : `/${user?.role || 'user'}/dashboard`;

  return (
    <nav className="bg-midnight-900 border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl bg-midnight-900/80">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold font-display text-white group">
            Talentora<span className="text-gold group-hover:animate-pulse">AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link to="/jobs" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-electric-purple after:transition-all hover:after:w-full">Jobs</Link>
            <Link to="/services" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-electric-purple after:transition-all hover:after:w-full">Services</Link>
            <Link to="/about" className="hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-electric-purple after:transition-all hover:after:w-full">About Us</Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-xl transition-all border border-transparent hover:border-white/10 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-purple to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-electric-purple/20">
                    {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <div className="hidden lg:block text-left">
                     <p className="text-sm font-bold text-white leading-none mb-0.5">{user?.name?.split(' ')[0]}</p>
                     <p className="text-[10px] text-gray-400 leading-none uppercase tracking-wide">{user?.role || 'User'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-64 bg-midnight-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up origin-top-right ring-1 ring-white/5">
                    
                    {/* User Header */}
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <p className="font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      <Link 
                        to={dashboardPath}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-electric-purple" />
                        Dashboard
                      </Link>

                      <Link 
                        to="/user/resume-builder"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <FileText size={18} className="text-green-400" />
                        Resume Builder
                      </Link>
                      
                      <Link 
                        to={`/${user?.role || 'user'}/profile`}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <User size={18} className="text-blue-400" />
                        My Profile
                      </Link>

                      <Link 
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <Settings size={18} className="text-gray-400" />
                        Settings
                      </Link>
                    </div>

                    <div className="p-2 border-t border-white/5">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium hover:text-white transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-electric-purple after:transition-all hover:after:w-full">Login</Link>
                <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-electric-purple to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-electric-purple/20 hover:shadow-electric-purple/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-midnight-900 absolute left-0 w-full px-4 shadow-xl z-50 animate-fade-in">
            <div className="flex flex-col gap-2 text-gray-300">
                <Link to="/jobs" className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Jobs</Link>
                <Link to="/services" className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">Services</Link>
                <Link to="/about" className="px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">About Us</Link>
                
                <div className="h-px bg-white/10 my-2"></div>
                
                {isAuthenticated ? (
                  <>
                     <div className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-electric-purple flex items-center justify-center text-white font-bold">
                          {user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-400">{user?.role}</p>
                        </div>
                     </div>
                     <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 rounded-xl transition-colors">
                        <LayoutDashboard size={18} /> Dashboard
                     </Link>
                     <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors w-full text-left">
                        <LogOut size={18} /> Logout
                     </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" className="w-full text-center py-3 rounded-xl hover:bg-white/5 font-medium transition-colors">Login</Link>
                    <Link to="/register" className="w-full text-center py-3 bg-electric-purple text-white rounded-xl font-bold hover:bg-electric-purple-light transition-colors">Sign Up</Link>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
