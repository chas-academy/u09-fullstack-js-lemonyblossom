import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure the correct import for jwtDecode

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
        const username = decodedToken.username;
        // Capitalize the first letter of the username
        const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
        setUsername(capitalizedUsername);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <div className="welcome-message flex flex-row w-full self-center text-xl font-semibold p-4">Hello, {username}!</div>
  );
};

export default UsernameDisplay;
