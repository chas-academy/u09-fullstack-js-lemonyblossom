import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  if (location.pathname === '/add-log') {
    return null; // Hide navbar on the add-log page
  }

  return (
    <nav className="navbar w-full max-w-[600px] bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-lg fixed bottom-0 z-10 text-white">
      <div className="max-w-[600px] mx-auto flex justify-around py-4 text-white text-sm md:text-base">
        <Link
          to="/logs"
          className={`${location.pathname === '/logs' ? 'border-b-2 border-white' : ''
            } hover:text-indigo-200 active:rotate-12 transition duration-300`}
        >
          Logs
        </Link>
        <Link
          to="/stats"
          className={`${location.pathname === '/stats' ? 'border-b-2 border-white' : ''
            } hover:text-indigo-200 transition duration-300`}
        >
          Stats
        </Link>
        <Link
          to="/add-log"
          className={`${location.pathname === '/add-log' ? 'border-b-2 border-white' : ''
            } hover:text-indigo-200 transition duration-300`}
        >
          Log
        </Link>
        <Link
          to="/profile"
          className={`${location.pathname === '/profile' ? 'border-b-2 border-white' : ''
            } hover:text-indigo-200 transition duration-300`}
        >
          Profile
        </Link>
        <Link
          to="/tools"
          className={`${location.pathname === '/tools' ? 'border-b-2 border-white' : ''
            } hover:text-indigo-200 transition duration-300`}
        >
          Tools
        </Link>

        {userRole === 'admin' && (
          <Link
            to="/admin"
            className={`${location.pathname === '/admin-dashboard' ? 'border-b-2 border-white' : ''
              } hover:text-indigo-200 transition duration-300`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
