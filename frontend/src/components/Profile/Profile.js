import { useNavigate } from 'react-router-dom';
import './profile.css'; 

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <p>Welcome to your profile page!</p>
   

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
