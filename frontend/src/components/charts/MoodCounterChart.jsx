import { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MoodCounterChart = () => {
  const [moodCounts, setMoodCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://u09-fullstack-js-lemonyblossom.onrender.com/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filteredData = response.data.filter(log => {
          const logDate = new Date(log.createdAt);
          return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });

        const counts = filteredData.reduce((acc, log) => {
          const mood = log.mood;
          if (!acc[mood]) {
            acc[mood] = 0;
          }
          acc[mood]++;
          return acc;
        }, {});

        setMoodCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const backgroundColors = [
    'rgba(255, 165, 0, 0.7)',  // orange
    'rgba(0, 191, 255, 0.7)',  // cyan
    'rgba(128, 0, 128, 0.7)',  // purple
    'rgba(255, 105, 180, 0.7)', // hot pink
    'rgba(75, 0, 130, 0.7)',    // indigo
  ];

  const chartData = {
    labels: Object.keys(moodCounts).map(mood => `Mood ${mood}`),
    datasets: [
      {
        label: 'Mood Count',
        data: Object.values(moodCounts),
        backgroundColor: backgroundColors.slice(0, Object.keys(moodCounts).length),
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full md:w-3/4 lg:w-3/5 mx-auto max-width-[600px]">
      <div className="max-w-full h-full">
        <h2 className="text-xl text-center mb-4">Monthly Moods</h2>
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            rotation: -90,
            circumference: 180,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.raw !== null) {
                      label += context.raw;
                    }
                    return label;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default MoodCounterChart;