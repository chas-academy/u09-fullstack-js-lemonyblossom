import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LogForm from './LogForm'; 
import './logs.css';  

const Logs = () => {
  const [username, setUsername] = useState('');
  const [logs, setLogs] = useState([]);
  const [editingLog, setEditingLog] = useState(null);  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);

        axios.get('http://localhost:5001/logs', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          setLogs(response.data);
        }).catch(error => {
          console.error('Error fetching logs:', error);
        });

      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:5001/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Log deleted');
      setLogs(logs.filter(log => log._id !== id));
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleSave = (updatedLog) => {
    setLogs(logs.map(log => (log._id === updatedLog._id ? updatedLog : log)));
    setEditingLog(null);  // Exit editing mode
  };

  return (
    <div className="logs-container">
      <h2>Welcome, {username}!</h2>
      <h1>Your Logs</h1>
      <p>Here you can find all your logs.</p>

      {/* Button to add a new log */}
      <Link to="/add-log" className="btn btn-primary">Create New Log</Link>

      {/* Display logs */}
      <div className="logs-list">
        {logs.map(log => (
          <div key={log._id} className="log-item">
            {editingLog === log._id ? (
              <LogForm
                log={log}
                onSave={handleSave}
                onCancel={() => setEditingLog(null)}
              />
            ) : (
              <div>
                <h3>Mood: {log.mood} / 5</h3>
                <p>Sleep: {log.sleepHours} hours</p>
                <p>Note: {log.note}</p>
                <p>Date: {new Date(log.createdAt).toLocaleDateString()}</p>
                <button onClick={() => setEditingLog(log._id)}>Edit</button>
                <button onClick={() => handleDelete(log._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Logs;
