import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const location = useLocation();

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
    </nav>
  );
};

export default Navbar;
