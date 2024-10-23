import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://u09-fullstack-js-lemonyblossom.onrender.com/users/login', { email, password });

      // If the user is blocked
      if (response.status === 403 && response.data.support) {
        setError(
          <>
            Your account is blocked. Please{' '}
            <a href={`mailto:${response.data.support}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">
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
    <div className="LOGIN flex justify-center p-2 w-screen md:max-w-[600px] lg:max-w-[800px] items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ease-out"
          >
            Login
          </button>
        </form>
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          {/*           <Link to="/forgot-password" className="hover:text-indigo-600 transition-colors duration-300">Forgot Password?</Link>
 */}          <p>
            Not registered?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
