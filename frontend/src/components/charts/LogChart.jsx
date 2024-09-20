import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LogChart = () => {
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
      if (!acc[date]) acc[date] = { mood: [], sleep: [] };
      acc[date].mood.push(log.mood);
      acc[date].sleep.push(log.sleepHours);
      return acc;
    }, {});

    const labels = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
    const moodData = labels.map(date =>
      groupedByDate[date].mood.reduce((a, b) => a + b, 0) / groupedByDate[date].mood.length
    );
    const sleepData = labels.map(date =>
      groupedByDate[date].sleep.reduce((a, b) => a + b, 0) / groupedByDate[date].sleep.length
    );

    return {
      labels,
      datasets: [
        {
          label: 'Mood',
          data: moodData,
          borderColor: 'purple',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          yAxisID: 'y1',
          borderWidth: 1,
          pointRadius: 4,
        },
        {
          label: 'Sleep Hours',
          data: sleepData,
          borderColor: 'lime',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          yAxisID: 'y2',
          borderWidth: 1,
          pointRadius: 4,
        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div>
      <h2>Sleep and Mood Data</h2>
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
            y1: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Mood (1-5)',
              },
            },
            y2: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'Sleep Hours',
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
  );
};

export default LogChart;
