import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed
import LogForm from '../components/LogForm';
import '../styles/logs.css';

const Logs = () => {
  const [username, setUsername] = useState('');
  const [logs, setLogs] = useState([]);
  const [editingLogId, setEditingLogId] = useState(null); // Track which log is being edited
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
      setLogs(logs.filter(log => log._id !== id)); // Update the UI
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleSave = (updatedLog) => {
    setLogs(logs.map(log => (log._id === updatedLog._id ? updatedLog : log)));
    setEditingLogId(null);  // Exit editing mode after saving
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const logDate = formatDate(log.createdAt);
    if (!acc[logDate]) acc[logDate] = [];
    acc[logDate].push(log);
    return acc;
  }, {});

  return (
    <>
          <div className="welcome-message">Welcome, {username}!</div>

    <div className="logs-container"> 
      <div className="logs-list">
        {Object.keys(groupedLogs).map(date => (
          <div key={date}>
            <h3 className="log-date-header">{date}</h3>
            {groupedLogs[date].map(log => (
              <div key={log._id} className="log-item">
                {editingLogId === log._id ? (
                  <LogForm
                    log={log}
                    onSave={handleSave}
                    onCancel={() => setEditingLogId(null)}
                  />
                ) : (
                  <div>
                    <p><strong>Time:</strong> {formatTime(log.createdAt)}</p>
                    <p><strong>Mood:</strong> {log.mood} / 5</p>
                    <p><strong>Sleep:</strong> {log.sleepHours} hours</p>
                    <p><strong>Note:</strong> {log.note}</p>
                    <button onClick={() => setEditingLogId(log._id)}>Edit</button>
                    <button onClick={() => handleDelete(log._id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Logs;
