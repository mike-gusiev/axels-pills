import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center">Завантаження…</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
