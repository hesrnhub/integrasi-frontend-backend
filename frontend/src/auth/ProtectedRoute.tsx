import { Navigate, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { Role } from '../api/types';
import { Loading } from '../components/Feedback';
import { useAuth } from './AuthContext';

// Menjaga halaman: loading -> belum login (/login) -> role tidak berhak (/forbidden).
export function ProtectedRoute({ roles, children }: { roles?: Role[]; children: ReactElement }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading text="Memeriksa sesi..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return children;
}
