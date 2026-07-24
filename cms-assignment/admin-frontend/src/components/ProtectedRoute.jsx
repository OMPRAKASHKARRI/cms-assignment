import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// Unauthenticated visits to any admin route redirect straight to LoginPage,
// preserving where they were headed so we can return them after login.
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
