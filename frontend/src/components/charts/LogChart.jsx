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
          borderColor: 'rgba(255, 255, 255, 1)', // White line for mood
          backgroundColor: 'rgba(255, 255, 255, 0.4)', // Slight transparency for fill
          yAxisID: 'y1',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#ffffff', // White points
          tension: 0.3,
        },
        {
          label: 'Sleep Hours',
          data: sleepData,
          borderColor: 'rgba(0, 0, 0, 0.8)', // Darker line for sleep
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // Transparent dark fill
          yAxisID: 'y2',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#000000', // Black points
          tension: 0.3,
        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div className="w-full md:w-3/4 lg:w-3/5 p-4 bg-white/10 rounded-lg shadow-lg border border-white/10">
      <div className="mx-auto max-w-full h-full">
        <h2 className="text-2xl text-center mb-6 text-white font-semibold">Sleep and Mood Data</h2>
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                ticks: { color: '#ffffff' }, // White labels on x-axis
                title: {
                  display: true,
                  text: 'Date',
                  color: '#ffffff',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)', // Light grid lines
                },
              },
              y1: {
                type: 'linear',
                position: 'left',
                ticks: { color: '#ffffff' }, // White labels on y1-axis
                title: {
                  display: true,
                  text: 'Mood (1-5)',
                  color: '#ffffff',
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.2)',
                },
              },
              y2: {
                type: 'linear',
                position: 'right',
                ticks: { color: '#ffffff' }, // White labels on y2-axis
                title: {
                  display: true,
                  text: 'Sleep Hours',
                  color: '#ffffff',
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#ffffff', // White legend text
                },
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark tooltip background
                bodyColor: '#ffffff', // White tooltip text
                borderColor: '#ffffff', // Tooltip border
                borderWidth: 1,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default LogChart;
