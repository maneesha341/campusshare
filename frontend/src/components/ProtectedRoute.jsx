import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap private pages: <ProtectedRoute><Dashboard /></ProtectedRoute>
// Pass adminOnly to restrict further to admin role.
// Pass studentOnly to keep admins off marketplace-action pages (sell, wishlist, chat, orders)
// even if they navigate there directly by URL — admins get their own Admin Panel instead.
const ProtectedRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  if (studentOnly && user.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
};

export default ProtectedRoute;