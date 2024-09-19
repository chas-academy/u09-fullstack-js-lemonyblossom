import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';


const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token, allow access
  return <Outlet />;
};

export default ProtectedRoutes;