import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/form.css';
import UsernameDisplay from '../components/UsernameDisplay';

const Profile = ({ setIsAuthenticated }) => {
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
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        try {
          const response = await axios.get('https://feelstate.netlify.app/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setIsAuthenticated(false);
          navigate('/login'); // Redirect to login if there's an error
        }
      }
    };

    fetchProfileData();
  }, [navigate, setIsAuthenticated]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'https://feelstate.netlify.app/users/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordChangeMessage(response.data.message);
      console.log('Password change successful:', response.data);
    } catch (error) {
      setPasswordChangeMessage(error.response?.data?.message || 'Error changing password');
      console.error('Error changing password:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>
      {/*       <UsernameDisplay />
 */}      <div className="form-container profile-container">
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
                className={`toggle-password-visibility ${showCurrentPassword ? 'hide-mode' : 'show-mode'}`}
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
                className={`toggle-password-visibility ${showNewPassword ? 'hide-mode' : 'show-mode'}`}
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button className="change-password-btn" type="submit">
            Change it!
          </button>
          {passwordChangeMessage && <p>{passwordChangeMessage}</p>}
        </form>


        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
