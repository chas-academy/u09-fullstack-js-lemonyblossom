import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LogChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://u09-fullstack-js-lemonyblossom.onrender.com/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const prepareData = () => {
    if (data.length === 0) return { labels: [], datasets: [] };

    const groupedByDate = data.reduce((acc, log) => {
      const date = new Date(log.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { mood: [], sleep: [] };
      acc[date].mood.push(log.mood);
      acc[date].sleep.push(log.sleepHours);
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
    const moodData = labels.map((date) =>
      groupedByDate[date].mood.reduce((a, b) => a + b, 0) / groupedByDate[date].mood.length
    );
    const sleepData = labels.map((date) =>
      groupedByDate[date].sleep.reduce((a, b) => a + b, 0) / groupedByDate[date].sleep.length
    );

    return {
      labels,
      datasets: [
        {
          label: 'Mood',
          data: moodData,
          borderColor: '#7f9cf5', // Light Indigo
          backgroundColor: 'rgba(127, 156, 245, 0.4)', // Light Indigo (transparent)
          yAxisID: 'y1',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#4f46e5', // Indigo for points
          tension: 0.3,
        },
        {
          label: 'Sleep Hours',
          data: sleepData,
          borderColor: '#5a67d8', // Darker Indigo
          backgroundColor: 'rgba(90, 103, 216, 0.4)', // Darker Indigo (transparent)
          yAxisID: 'y2',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#6b46c1', // Purple for points
          tension: 0.3,
        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div className="w-full md:w-3/4 lg:w-3/5">
      <div className="mx-auto max-w-full h-full">
        <h2 className="text-xl text-center mb-4 text-white">Sleep and Mood Data</h2> {/* Updated text color */}
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'category',
                ticks: {
                  color: '#e0e7ff', // Light text color
                  font: {
                    family: 'sans-serif',
                  },
                },
                title: {
                  display: true,
                  text: 'Date',
                  color: '#c7d2fe',
                  font: {
                    size: 14,
                    weight: 'bold',
                    family: 'sans-serif',
                  },
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
                },
              },
              y1: {
                type: 'linear',
                position: 'left',
                ticks: {
                  color: '#e0e7ff',
                  font: {
                    family: 'sans-serif',
                  },
                },
                title: {
                  display: true,
                  text: 'Mood (1-5)',
                  color: '#c7d2fe',
                  font: {
                    size: 14,
                    weight: 'bold',
                    family: 'sans-serif',
                  },
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)', // Subtle grid lines
                },
              },
              y2: {
                type: 'linear',
                position: 'right',
                ticks: {
                  color: '#e0e7ff',
                  font: {
                    family: 'sans-serif',
                  },
                },
                title: {
                  display: true,
                  text: 'Sleep Hours',
                  color: '#c7d2fe',
                  font: {
                    size: 14,
                    weight: 'bold',
                    family: 'sans-serif',
                  },
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: '#e0e7ff', // Light legend text
                  font: {
                    family: 'sans-serif',
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y.toFixed(2);
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

export default LogChart;
