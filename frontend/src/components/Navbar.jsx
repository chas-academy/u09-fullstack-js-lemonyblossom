import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  const location = useLocation();

  // Hide navbar on the add-log page
  if (location.pathname === '/add-log') {
    return null;
  }

  return (
    <nav className="navbar w-screen md:max-w-[600px] lg:max-w-[1200px] shadow-lg fixed bottom-0 z-10">
      <div className="bg-gradient-to-b from-white/70 to-indigo-300/60 backdrop-blur-md max-w-[600px] mx-auto flex justify-around items-center py-2 font-bold text-base rounded-t-xl">

        <Link to="/">
          <img src="/logo192.png" alt="Logo" className="h-11 w-auto hover:scale-110" />
        </Link>

        <Link to="/logs">
          <img src="/binder.png" alt="Logs" className="h-11 w-auto hover:scale-110" />
        </Link>

        <Link to="/add-log">
          <img src="/plus.png" alt="add-log-heart" className="h-11 w-auto hover:scale-110" />
        </Link>

        <Link to="/stats">
          <img src="/growth.png" alt="add-log-heart" className="h-11 w-auto hover:scale-110" />
        </Link>

        <Link to="/tools">
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
