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
  TimeScale,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const RangeChart = () => {
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

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const prepareData = () => {
    if (data.length === 0) return { labels: [], datasets: [] };

    const groupedByDate = data.reduce((acc, log) => {
      const date = new Date(log.createdAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { minMood: log.mood, maxMood: log.mood };
      else {
        acc[date].minMood = Math.min(acc[date].minMood, log.mood);
        acc[date].maxMood = Math.max(acc[date].maxMood, log.mood);
      }
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate).sort();
    const minMoodData = labels.map((date) => groupedByDate[date].minMood);
    const maxMoodData = labels.map((date) => groupedByDate[date].maxMood);

    return {
      labels,
      datasets: [
        {
          label: 'Min Mood',
          data: minMoodData,
          borderColor: 'rgba(0, 191, 255, 1)', // cyan
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          fill: 'origin',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: 'Max Mood',
          data: maxMoodData,
          borderColor: 'rgba(255, 165, 0, 1)', // orange
          backgroundColor: 'rgba(255, 165, 0)',
          fill: '-1',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div className="w-full md:w-3/4 lg:w-3/5 mx-auto">
      <div className="mx-auto max-w-full h-full">
        <h2 className="text-xl text-center mb-4">Mood Range Data</h2>
        <Line
          ref={chartRef}
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Date',
                  color: '#f0e68c',  // Light goldenrod for high contrast
                },
                ticks: {
                  color: '#f0e68c',  // Same color for ticks
                },
                grid: {
                  color: 'rgba(240, 230, 140, 0.3)',  // Light goldenrod grid with low opacity
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Mood',
                  color: '#f0e68c',  // Same light goldenrod for y-axis title
                },
                ticks: {
                  color: '#f0e68c',  // Same for ticks
                },
                grid: {
                  color: 'rgba(240, 230, 140, 0.3)',  // Same light goldenrod for grid
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#ffffff',  // Bright white for high contrast against dark background
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

export default RangeChart;
