import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.roleId !== 1) {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    if (user.roleId !== 1) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 