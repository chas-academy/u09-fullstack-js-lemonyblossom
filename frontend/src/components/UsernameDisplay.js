import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';

const UsernameDisplay = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="welcome-message">Welcome, {username}!</div>
  );
};

export default UsernameDisplay;
