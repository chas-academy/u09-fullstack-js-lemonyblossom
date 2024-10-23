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
          `https://u09-fullstack-js-lemonyblossom.onrender.com/logs/${log._id}`,
          { mood, sleepHours, note },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onSave(data.log);
      } else {
        const { data } = await axios.post(
          'https://u09-fullstack-js-lemonyblossom.onrender.com/logs',
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
    <div className="log-container flex flex-col items-center w-full h-full p-3 text-black ">
      {/* Exit button */}
      {onCancel && (
        <button
          className="exit-btn w-8 h-8 flex items-center justify-center self-end mb-4 bg-gradient-to-br  from-indigo-500 to-blue-300 text-white rounded-full shadow shadow-indigo-800 hover:from-pink-500 hover:to-orange-400 transition duration-300 hover:animate-spinOnce"

          type="button"
          onClick={onCancel}
        >
          x
        </button>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-start space-y-6 ">
        {/* Mood */}
        <div className="w-full">
          <label className="w-full text-md font-semibold mb-1">Mood:</label>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value)}
                className={`w-20 h-10 md:w-24 md:h-12 font-bold rounded-full hover:shadow-md flex items-center justify-center transition-transform duration-300 ease-out hover:scale-105  ${mood === value
                  ? 'bg-gradient-to-br  from-pink-500 to-orange-400 border-2 border-white text-white shadow:sm animate-pulse'
                  : 'bg-gradient-to-br  from-indigo-500 to-blue-300 text-white'
                  }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Hours Slider */}
        <div className="w-full">
          <label className="w-full text-md font-semibold mb-1">Sleep Hours: {sleepHours}</label>
          <input
            type="range"
            min="0"
            max="12"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="w-full appearance-none h-2 bg-white rounded-lg focus:outline-white/60 focus:ring-2 focus:ring-indigo-200/50 transition-all"
          />
          <div className="flex justify-between text-sm mt-2">
            <span>0h</span>
            <span>12h</span>
          </div>
        </div>

        {/* Note Input */}
        <div className="w-full">
          <label className="w-full  text-md font-semibold mb-1">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 rounded-md shadow-sm border-2 border-white bg-white/80 text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Enter your notes..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-gradient-to-br  from-indigo-500 to-blue-300 text-white font-semibold w-[6rem] max-w-[6rem] py-3 mt-4 rounded-full shadow-md shadow-indigo-800 ring-2 ring-inset hover:ring-white hover:bg-gradient-to-br  hover:from-pink-500 hover:to-orange-400  hover:shadow-sm hover:animate-pulse hover:text-white transition duration-300"
        >
          {log ? 'Save' : 'Add Log'}
        </button>
      </form>
    </div>
  );
};

export default LogForm;
