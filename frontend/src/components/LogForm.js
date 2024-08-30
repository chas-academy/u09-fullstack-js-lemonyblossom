import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css';

const LogForm = ({ log, onSave, onCancel }) => {
  const [mood, setMood] = useState(log ? log.mood : 3);
  const [sleepHours, setSleepHours] = useState(log ? log.sleepHours : 8);
  const [note, setNote] = useState(log ? log.note : '');
  const navigate = useNavigate();

  useEffect(() => {
    if (log) {
      setMood(log.mood);
      setSleepHours(log.sleepHours);
      setNote(log.note);
    }
  }, [log]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (log) {
        const { data } = await axios.put(
          `http://localhost:5001/logs/${log._id}`,
          { mood, sleepHours, note },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(data.log);
      } else {
        const { data } = await axios.post(
          'http://localhost:5001/logs',
          { mood, sleepHours, note },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Log created:', data);
        navigate('/logs');
      }
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>{log ? 'Edit Log' : 'Add a New Log'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mood (1-5):</label>
          <input
            type="number"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Sleep Hours:</label>
          <input
            type="number"
            min="0"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button type="submit">{log ? 'Done' : 'Add Log'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
};

export default LogForm;
