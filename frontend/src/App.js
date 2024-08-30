import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoute/ProtectedRoutes'; // Ensure this component is correctly implemented
import { useEffect, useState } from 'react';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Logs from './pages/Logs';
import LogForm from './components/LogForm';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Stats from './pages/Stats';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5001/verifyToken', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            setIsAuthenticated(true); // User is authenticated
          } else {
            localStorage.removeItem('token'); // Token invalid? -> Clear
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Token verification failed', error);
          localStorage.removeItem('token'); // Clear invalid token
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Done auth cehck
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      </Routes>
        <div className='page-container'>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/logs" element={<Logs />} />
            <Route path="/add-log" element={<LogForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
          {/* Redirect based on authentication status */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/logs" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Navbar />
      </div>
    </Router>
  );
}

export default App;
