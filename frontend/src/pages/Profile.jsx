import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          const response = await axios.get('https://u09-fullstack-js-lemonyblossom.onrender.com/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfileData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setIsAuthenticated(false);
          navigate('/login');
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
        'https://u09-fullstack-js-lemonyblossom.onrender.com/users/change-password',
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
    <div className="flex flex-col items-center justify-center w-screen md:max-w-[600px] lg:[1200px] min-h-screen bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 text-white py-10 px-4">
      <h2 className="text-4xl font-bold mb-6">Profile</h2>

      <div className="bg-white/80 text-gray-900 rounded-lg shadow-lg p-6 mb-8 w-full max-w-lg mx-auto">
        <div className="user-info mb-6">
          <p className="text-lg"><strong>Username:</strong> {profileData.username}</p>
          <p className="text-lg"><strong>Email:</strong> {profileData.email}</p>
          <p className="text-lg"><strong>Signed up:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
        </div>

        <form className="change-password-form space-y-4" onSubmit={handlePasswordChange}>
          <h3 className="text-2xl font-semibold mb-4">Change Password</h3>

          {/* Current Password */}
          <div className="password-field-container">
            <label className="block mb-1">Current Password:</label>
            <div className="password-input-group flex">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                {showCurrentPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="password-field-container">
            <label className="block mb-1">New Password:</label>
            <div className="password-input-group flex">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out w-full"
            type="submit"
          >
            Change it!
          </button>
          {passwordChangeMessage && <p className="mt-4 text-center text-red-500">{passwordChangeMessage}</p>}
        </form>
      </div>

      <button
        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
