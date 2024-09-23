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
        const response = await axios.get('http://localhost:5001/logs', {
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
    const minMoodData = labels.map(date => groupedByDate[date].minMood);
    const maxMoodData = labels.map(date => groupedByDate[date].maxMood);

    return {
      labels,
      datasets: [
        {
          label: 'Mood Range',
          data: minMoodData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: 'origin',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: '',
          data: maxMoodData,
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: '-1',
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div className="chart-wrapper">
      <div className="chart-container">
        <h2>Mood Range Data</h2>
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
                },
              },
              y: {
                type: 'linear',
                title: {
                  display: true,
                  text: 'Mood (1-5)',
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
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
