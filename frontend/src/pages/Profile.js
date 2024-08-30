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
        'http://localhost:5001/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordChangeMessage(response.data.message);
    } catch (error) {
      setPasswordChangeMessage('Error changing password');
      console.error('Error changing password:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
    
      <UsernameDisplay />
      <div className="form-container">
      <h2>Profile</h2>
        <p><strong>Username:</strong> {profileData.username}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Account Created On:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>

        <form className="change-password-form" onSubmit={handlePasswordChange}>
          <h3>Change Password</h3>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Change Password</button>
          {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
        </form>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
