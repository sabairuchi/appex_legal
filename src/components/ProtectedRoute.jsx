import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        backgroundColor: 'var(--navy-primary)',
        color: 'var(--white)'
      }}>
        <div style={{
          fontSize: '24px',
          fontFamily: 'var(--font-display)',
          color: 'var(--gold-accent)',
          marginBottom: '15px'
        }}>
          APEX LEGAL
        </div>
        <p style={{ color: 'var(--gray-light)', fontSize: '14px', letterSpacing: '1px' }}>
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
