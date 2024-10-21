import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/form.css';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://feelstate.netlify.app/users/register', {
        username,
        email,
        password,
      });

      console.log('User registered:', response.data);


      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token saved:', response.data.token);

        navigate('/logs');
      } else {
        console.error('No token received');
      }

    } catch (error) {
      console.error('There was an error registering!', error);

      if (error.response && error.response.data.message) {
        console.error('Error message from server:', error.response.data.message);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      <p>Already registered? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
