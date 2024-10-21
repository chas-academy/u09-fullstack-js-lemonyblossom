import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
          `https://feelstate.netlify.app/logs/${log._id}`,
          { mood, sleepHours, note },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(data.log);
      } else {
        const { data } = await axios.post(
          'https://feelstate.netlify.app/logs',
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
    <div className="log-container flex flex-col items-center max-w-[600px] w-[100%] max-h-full">
      {/* Exit button */}
      {onCancel && (
        <button
          className="exit-btn w-8 h-8 flex items-center justify-center self-end mb-4  hover:animate-spinOnce"
          type="button"
          onClick={onCancel}
        >
          x
        </button>
      )}

      {/*       <h2 className="text-l font-semibold text-left w-full mb-5">{log ? 'Edit Log' : 'Add a New Log'}</h2>
 */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-start space-y-6">

        {/* Mood */}
        <div className="w-full">
          <label className="w-full text-gray-700 text-md font-semibold mb-1">Mood:</label>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value)}
                className={`w-24 h-12 font-bold rounded-full flex items-center justify-center border hover:animate-pulse hover:scale-110 ${mood === value ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="w-full">
          <label className="w-full text-gray-700 text-md font-semibold mb-1 ">Sleep Hours:</label>
          <div className="flex space-x-4">
            {[
              { label: '0', value: 0 },
              { label: '< 4 ', value: 3 },
              { label: '5', value: 5 },
              { label: '6', value: 6 },
              { label: '7', value: 7 },
              { label: '8', value: 8 },
              { label: '9', value: 9 },
              { label: '> 10', value: 10 }
            ].map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSleepHours(value)}
                className={`w-24 h-12 rounded-full flex items-center justify-center border font-bold hover:animate-pulse hover:scale-110 ${sleepHours === value ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="w-full">
          <label className="w-full text-gray-700 text-md font-semibold mb-1">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-white text-black w-24 self-center max-w-xs py-3 mt-4 rounded-full shadow-lg hover:bg-black hover:text-white transition duration-300"
        >
          {log ? 'Save' : 'Add Log'}
        </button>
      </form>
    </div>
  );
};

export default LogForm;
