import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogForm from '../components/LogForm';
import UsernameDisplay from '../components/UsernameDisplay';
import { useFade } from '../hooks/useFade';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [editingLogId, setEditingLogId] = useState(null); // Track which log is being edited
  const navigate = useNavigate();

  const { isVisible, shouldRender, fadeIn, fadeOut } = useFade(300);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('https://u09-fullstack-js-lemonyblossom.onrender.com/logs', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setLogs(response.data);
        })
        .catch(error => {
          console.error('Error fetching logs:', error);
        });
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://u09-fullstack-js-lemonyblossom.onrender.com/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(logs.filter(log => log._id !== id)); // Update the UI
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleSave = (updatedLog) => {
    setLogs(logs.map(log => (log._id === updatedLog._id ? updatedLog : log)));
    fadeOut(() => setEditingLogId(null));
  };

  const handleEditClick = (logId) => {
    fadeOut(() => {
      setEditingLogId(logId);
      fadeIn();
    });
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
      <UsernameDisplay />
      <div className="logs-container flex flex-col max-w-screen mx-auto py-7">
        {/* Logs grouped by date */}
        <div className="logs-list w-screen max-w-[800px] flex flex-col justify-center">
          {Object.keys(groupedLogs).map(date => (
            <div key={date} className="log-group mb-5">
              <h3 className="log-date-header text-lg font-bold mb-3 ml-5">{date}</h3>
              {groupedLogs[date].map(log => (
                <div
                  key={log._id}
                  className={`log-item bg-white/80 p-4 mb-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${editingLogId === log._id ? 'max-h-[800px]' : 'max-h-[200px]'
                    } overflow-hidden`} // Smoothly expand or collapse
                >
                  {editingLogId === log._id && shouldRender ? (
                    <div className={`LogForm-Container flex  transition-opacity duration-300 justify-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                      <LogForm
                        log={log}
                        onSave={handleSave}
                        onCancel={() => fadeOut(() => setEditingLogId(null))}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="log-item-content min-w-full flex flex-col text-left">
                        <p className="font-semibold">
                          <strong>Time:</strong> {formatTime(log.createdAt)}
                        </p>
                        <p><strong>Mood:</strong> {log.mood} / 5</p>
                        <p><strong>Sleep:</strong> {log.sleepHours} hours</p>
                        <p><strong>Note:</strong> {log.note}</p>
                      </div>
                      <div className="btn-container mt-2 flex justify-between">
                        <button
                          onClick={() => handleEditClick(log._id)}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(log._id)}>Delete</button>
                      </div>
                    </>
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
