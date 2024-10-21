import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
   const [email, setEmail] = useState('');
   const [message, setMessage] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.post('https://feelstate.netlify.app/password/request-password-reset', { email });
         setMessage('Password reset link has been sent to your email.');
         setError('');
      } catch (error) {
         setError('Error sending password reset link');
         setMessage('');
      }
   };

   return (
      <div className="form-container">
         <h2>Forgot Password</h2>
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
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit">Request Password Reset</button>
         </form>
      </div>
   );
};

export default ForgotPassword;
