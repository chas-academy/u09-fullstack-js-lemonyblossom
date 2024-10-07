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
          'rgba(250, 250, 250, 0.8)',
          'rgba(200, 200, 200, 0.8)',
          'rgba(150, 150, 150, 0.8)',
          'rgba(100, 100, 100, 0.8)',
          'rgba(50 , 50, 50, 0.8)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)'
          /*    'rgba(2, 99, 132, 1)',
             'rgba(54, 162, 235, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(75, 192, 192, 1)',
             'rgba(153, 102, 255, 1)', */
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-container">
        <h2>Monthly Moods</h2>
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
