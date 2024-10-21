import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
   const { token } = useParams(); // Access the token from the URL
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');
   const [message, setMessage] = useState('');
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (newPassword !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      try {
         const response = await axios.post(`https://feelstate.netlify.app/password/reset-password/${token}`, { newPassword });
         setMessage('Password has been reset successfully. You can now login.');
         setError('');
         setTimeout(() => {
            navigate('/login'); // Redirect user to login page after password reset
         }, 3000);
      } catch (error) {
         setError(error.response?.data?.message || 'Failed to reset password');
         setMessage('');
      }
   };

   return (
      <div className="form-container">
         <h2>Reset Password</h2>
         <form onSubmit={handleSubmit}>
            <div>
               <label>New Password:</label>
               <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
               />
            </div>
            <div>
               <label>Confirm Password:</label>
               <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
               />
            </div>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
            <button type="submit">Reset Password</button>
         </form>
      </div>
   );
};

export default ResetPassword;
