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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Tools from './pages/Tools';
import NewLogForm from './components/NewLogForm';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(['https://u09-fullstack-js-lemonyblossom.onrender.com/verifyToken', 'http://localhost:5001/verifytoken'], {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App fixed inset-0 mx-auto flex items-start justify-center md:max-w-[600px] lg:max-w-[1200px] w-screen h-screen font-sans bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 overflow-hidden overflow-y-auto">

        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/logs" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          <Route path="/add-log" element={isAuthenticated ? <NewLogForm setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
          <Route path="/stats" element={isAuthenticated ? <Stats /> : <Navigate to="/login" />} />  {/* Add Stats route */}

          <Route path="/register" element={<Register />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />


        </Routes>
        <Navbar />

      </div>

    </Router>
  );
}

export default App;
