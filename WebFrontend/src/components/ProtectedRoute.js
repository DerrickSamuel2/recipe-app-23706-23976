/**
 * ProtectedRoute forces authentication before rendering the child route.
 */
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Protect routes that require authentication. */
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="container">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
