import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role - redirect to appropriate dashboard
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
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