import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/form.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/users/login', { email, password });

      // If the user is blocked
      if (response.status === 403 && response.data.support) {
        setError(
          <>
            Your account is blocked. Please{' '}
            <a href={`mailto:${response.data.support}`} target="_blank" rel="noopener noreferrer">
              contact support
            </a>.
          </>
        );
      } else if (response.data.token) {
        // Handle successful login
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/logs');
      } else {
        setError('Login failed: No token received');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>Not registered? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default Login;
