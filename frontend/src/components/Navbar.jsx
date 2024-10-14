import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        // Decode the token's payload to get the user's role
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.role); // Set the role from token
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
      }
    }
  }, []);

  return (
    <nav className="navbar">
      <Link to="/logs" className={location.pathname === '/logs' ? 'active' : ''}>
        Logs
      </Link>
      <Link to="/stats" className={location.pathname === '/stats' ? 'active' : ''}>
        Stats
      </Link>
      <Link to="/add-log" className={location.pathname === '/add-log' ? 'active' : ''}>
        Log
      </Link>
      <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
        Profile
      </Link>
      <Link to="/tools" className={location.pathname === '/tools' ? 'active' : ''}>
        Tools
      </Link>

      {userRole === 'admin' && (
        <Link to="/admin" className={location.pathname === '/admin-dashboard' ? 'active' : ''}>
          Admin Dashboard
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
