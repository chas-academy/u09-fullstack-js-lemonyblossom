import { Link, useLocation } from 'react-router-dom';
import './navbar.css'; 

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/logs" className={location.pathname === '/logs' ? 'active' : ''}>
        Logs
      </Link>
      <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
        History
      </Link>
      <Link to="/add-log" className={location.pathname === '/add-log' ? 'active' : ''}>
        Add Log
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
