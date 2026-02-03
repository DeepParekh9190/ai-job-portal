import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth);

  // If we have a token but are loading the user, show loader
  if (loading && token && !user) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-electric-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !token) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Authenticated but user object is still missing (wait for it)
  if (!user) {
     return null; // Or a loader
  }

  // Authenticated but wrong role - redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute: Role ${user.role} not in allowed:`, allowedRoles);
    if (user.role === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    }
    if (user.role === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authorized - render children
  return children;
};

export default ProtectedRoute;