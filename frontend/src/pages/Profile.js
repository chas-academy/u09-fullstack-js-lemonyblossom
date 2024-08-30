import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/form.css';
import UsernameDisplay from '../components/UsernameDisplay';

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const response = await axios.get('http://localhost:5001/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          navigate('/login'); // Redirect to login if there's an error
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:5001/users/change-password', // Ensure this matches your backend route
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordChangeMessage(response.data.message);
      console.log('Password change successful:', response.data);  // Log success response
    } catch (error) {
      setPasswordChangeMessage(error.response?.data?.message || 'Error changing password');
      console.error('Error changing password:', error);  // Log error details
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <UsernameDisplay />
      <div className="form-container profile-container">
        <h2>Profile</h2>
        <div className='user-info'>
        <p><strong>Username:</strong> {profileData.username}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Signed up:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
        </div>
        <form className="change-password-form" onSubmit={handlePasswordChange}>
          <h3>Change Password</h3>
          <div className="password-field-container">
            <label>Current Password:</label>
            <div className="password-input-group">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="toggle-password-visibility"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="password-field-container">
            <label>New Password:</label>
            <div className="password-input-group">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="toggle-password-visibility"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button className="change-password" type="submit">Change it!</button>
          {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
        </form>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
