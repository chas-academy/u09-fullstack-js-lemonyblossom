import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <div className="logs-container flex flex-col h-screen w-screen md:max-w-[600px] lg:[1200px] text-white scrollbar-none">
        {/* <div className='GreetingAndProfile flex flex-row justify-between p-2'>
          <UsernameDisplay />
          <Link
            to="/profile"
            className="ADD-LOG fixed top-10 right-10 flex justify-center items-center text-xl hover:scale-150 hover:bg-indigo-600/60 hover:border hover:border-indigo-200 w-10 h-10 rounded-full bg-indigo-400 active:scale-110 transition-transform duration-300 text-white"
          >
            +
          </Link>
        </div> */}
        <div className="GreetingAndProfile w-full flex flex-row justify-between p-2">
          <UsernameDisplay />
          <Link
            to="/profile">
            <img src="/user-fill.png" alt="Logo" className="h-11 w-12 hover:scale-110" />

          </Link>
        </div>
        {/* Logs grouped by date */}
        <div className="logs-list w-full max-w-3xl space-y-6">
          {Object.keys(groupedLogs).map(date => (
            <div key={date} className="log-group mb-8">
              <h3 className="log-date-header text-l italic font-semibold  mb-6 pl-2 text-white">{date}</h3>
              {groupedLogs[date].map((log, index) => (
                <div
                  key={log._id}
                  className={`log-item bg-white/80 p-4 md:p-6 mb-6 rounded-xl shadow-lg transform transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl ${editingLogId === log._id ? 'max-h-[800px]' : 'max-h-[300px]'
                    } overflow-hidden w-full max-w-md mx-auto`}
                  style={{
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: `fadeInUp 0.5s ease-in-out forwards`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  {editingLogId === log._id && shouldRender ? (
                    <div className={`LogForm-Container flex justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                      <LogForm
                        log={log}
                        onSave={handleSave}
                        onCancel={() => fadeOut(() => setEditingLogId(null))}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="log-item-content flex flex-col text-left space-y-2 text-gray-900 text-sm md:text-base">
                        <p className="font-semibold">
                          <strong>Time:</strong> {formatTime(log.createdAt)}
                        </p>
                        <p><strong>Mood:</strong> {log.mood} / 5</p>
                        <p><strong>Sleep:</strong> {log.sleepHours} hours</p>
                        <p><strong>Note:</strong> {log.note}</p>
                      </div>
                      <div className="btn-container mt-4 flex justify-between space-x-2 md:space-x-4">
                        <button
                          className="bg-indigo-600 text-white font-semibold py-1 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-indigo-500 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out text-sm md:text-base"
                          onClick={() => handleEditClick(log._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white font-semibold py-1 px-3 md:py-2 md:px-4 rounded-lg shadow-md hover:bg-red-400 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-out text-sm md:text-base"
                          onClick={() => handleDelete(log._id)}
                        >
                          Delete
                        </button>
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
