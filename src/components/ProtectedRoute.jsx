import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Preserve target location so Login can redirect back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
