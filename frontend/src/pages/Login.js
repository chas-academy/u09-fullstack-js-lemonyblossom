import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/form.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending a POST request to login
      const response = await axios.post('http://localhost:5001/users/login', {
        email,
        password,
      });

      console.log('User logged in:', response.data);

      // Save the token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token saved:', response.data.token);

        // Redirect to /logs page
        navigate('/logs'); 
      } else {
        setError('Login failed: No token received');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="form-container">
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
        {error && <p className="error">{error}</p>} {/* Display error message */}
        <button type="submit">Login</button>
      </form>
      <p>Not registered? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
