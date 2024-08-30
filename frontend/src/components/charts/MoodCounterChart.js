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
        const response = await axios.get('http://localhost:5001/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter logs to only include entries from the current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filteredData = response.data.filter(log => {
          const logDate = new Date(log.createdAt);
          return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
        });

        // Count mood levels
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

  // Prepare data for the chart
  const chartData = {
    labels: Object.keys(moodCounts).map(mood => `Mood ${mood}`),
    datasets: [
      {
        label: 'Mood Count',
        data: Object.values(moodCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Mood Count for the Current Month</h2>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true, // Change this to true if you don't want to change the aspect ratio
          aspectRatio: 2, // Adjust this value to control the height-to-width ratio
          rotation: -90, // For half doughnut
          circumference: 180, // For half doughnut
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
      />    </div>
  );
};

export default MoodCounterChart;
