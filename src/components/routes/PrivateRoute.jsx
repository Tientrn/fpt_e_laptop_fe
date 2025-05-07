import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ROLES = {
    ADMIN: 1,
    STUDENT: 2,
    SPONSOR: 3,
    STAFF: 4,
    MANAGER: 5,
    SHOP: 6,
};

export const ROLE_NAMES = {
    1: 'Admin',
    2: 'Student',
    3: 'Sponsor',
    4: 'Staff',
    5: 'Manager',
    6: 'Shop',
};

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token'); // Check if user is logged in
  let userRole = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userRole = user?.roleId;
  } catch {
    userRole = null;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có specified roles và user's role không nằm trong đó
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export { PrivateRoute };