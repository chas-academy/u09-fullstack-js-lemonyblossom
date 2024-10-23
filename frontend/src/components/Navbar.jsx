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
    <nav className="navbar w-screen md:max-w-[600px] lg:max-w-[1200px] shadow-lg fixed bottom-0 z-10">
      <div className="bg-gradient-to-b from-white/70 to-indigo-300/60 backdrop-blur-md max-w-[600px] mx-auto flex justify-around items-center py-2 font-bold text-base rounded-t-xl">
        {/* Add the Logo Here */}
        <Link to="/">
          <img src="/logo192.png" alt="Logo" className="h-11 w-auto hover:scale-110" />
        </Link>

        {/* Link styles (no blur, crisp text) */}
        <Link
          to="/logs"
        >          <img src="/binder.png" alt="Logs" className="h-11 w-auto hover:scale-110" />
        </Link>


        {/* Add Log Button */}
        <Link
          to="/add-log">
          <img src="/plus.png" alt="add-log-heart" className="h-11 w-auto hover:scale-110" />

        </Link>

        <Link
          to="/stats" >  <img src="/growth.png" alt="add-log-heart" className="h-11 w-auto hover:scale-110" />
        </Link>

        <Link
          to="/tools">
          <img src="/mental-health.png" alt="add-log-heart" className="h-11 w-auto hover:scale-110" />
        </Link>

        {userRole === 'admin' && (
          <Link
            to="/admin"
            className="hover:scale-90 active:scale-110 transition duration-300 text-white"
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
