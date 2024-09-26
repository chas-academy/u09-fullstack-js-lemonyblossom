import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Logs from './pages/Logs';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ProtectedRoutes from './components/ProtectedRoute/ProtectedRoutes';

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
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/logs" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/logs" element={isAuthenticated ? <Logs /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Navbar />
    </Router>
  );
}

export default App;
