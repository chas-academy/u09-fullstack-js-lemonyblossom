import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './posts.css';  

const Posts = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If none, redirect to login
      navigate('/login');
    } else {
      try {
        // Decode token to get user info
        const decodedToken = jwtDecode(token);

        // Extract username 
        setUsername(decodedToken.username);  
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login'); 
      }
    }
  }, [navigate]);

  return (
    <div className="posts-container">
      {/* Display the username at the top */}
      <h2>Welcome, {username}!</h2>
      <h1>Posts Page</h1>
      
    </div>
  );
};

export default Posts;
