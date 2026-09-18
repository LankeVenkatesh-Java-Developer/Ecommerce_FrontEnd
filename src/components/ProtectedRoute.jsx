import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false, requireSuperAdmin = false }) => {
  const { isAuthenticated, loading, role } = useSelector((state) => state.auth);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin) {
    if (role !== 'SUPER_ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requireAdmin) {
    const isAdminRole = role === 'ADMIN' || role === 'SUPER_ADMIN';
    if (!isAdminRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
