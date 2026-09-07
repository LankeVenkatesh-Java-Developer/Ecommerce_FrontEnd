import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, loading, role } = useSelector((state) => state.auth);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const isAdminRole = role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'CUSTOMER';
    if (!isAdminRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
