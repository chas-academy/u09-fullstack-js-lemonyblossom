import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ isAuthenticated, requiredRole, userRole }) => {
  // If the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If the route requires a specific role (e.g., admin), check user role
  if (requiredRole && requiredRole !== userRole) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated (and role is valid if applicable), render the route
  return <Outlet />;
};

export default ProtectedRoutes;
