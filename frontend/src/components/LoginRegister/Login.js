import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './style.css';  

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      });

      console.log('User logged in:', response.data);

      // Save the token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token saved:', response.data.token);

        // Redirect to /posts page
        navigate('/posts'); // Use navigate to redirect
      } else {
        console.error('Login failed: No token received');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Not registered? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
