import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Navbar from './components/Navbar';
/* import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword'; */
import AdminDashboard from './pages/AdminDashboard';
import Tools from './pages/Tools';
import NewLogForm from './components/NewLogForm';
import loaderIcon from '../src/loading.png';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch("https://u09-fullstack-js-lemonyblossom.onrender.com/verifyToken",
            {
              headers: { Authorization: `Bearer ${token}` },
            });

          if (response.ok) {
            setIsAuthenticated(true);

            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decodedToken.role);

          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUserRole(null);
          }

        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserRole(null);
        }

      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="LOADER fixed inset-0 mx-auto p-2 flex items-start justify-center md:max-w-[600px] lg:max-w-[1200px] w-screen h-screen font-sans bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 overflow-hidden overflow-y-auto">
        <div className="relative flex items-center justify-center w-36 h-36 rounded-full animate-spinSlow">
          <img src={loaderIcon} alt="Loading..." className="absolute w-24 h-24" /> {/* Customize size */}
        </div>
      </div>
    );
  }
  return (
    <Router>
      <div className="App fixed inset-0 mx-auto p-2 flex items-start justify-center md:max-w-[600px] lg:max-w-[1200px] w-screen h-screen font-sans bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 overflow-hidden overflow-y-auto">

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={isAuthenticated ? <Logs /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/tools" element={<Tools />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> */}

          <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          <Route path="/add-log" element={isAuthenticated ? <NewLogForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          <Route path="/stats" element={isAuthenticated ? <Stats /> : <Navigate to="/login" />} />  {/* Add Stats route */}

          <Route path="*" element={<Navigate to="/" />} />



        </Routes>
        <Navbar userRole={userRole} />

      </div>

    </Router>
  );
}

export default App;
