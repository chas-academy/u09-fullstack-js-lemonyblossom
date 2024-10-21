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
        const response = await axios.get('https://feelstate.netlify.app/logs', {
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
          borderColor: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          yAxisID: 'y1',
          borderWidth: 1,
          pointRadius: 2,
          tension: 0.2,

        },
        {
          label: 'Sleep Hours',
          data: sleepData,
          borderColor: 'rgba(50, 50, 50, 1)',
          backgroundColor: 'rgba(50, 50, 50, 0.4)',
          yAxisID: 'y2',
          borderWidth: 1,
          pointRadius: 2,
          tension: 0.2,

        },
      ],
    };
  };

  const chartData = prepareData();

  return (
    <div className="w-full md:w-3/4 lg:w-3/5">
      <div className="mx-auto max-w-full h-full">
        <h2 className="text-xl text-center mb-4">Sleep and Mood Data</h2>
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
    </div>
  );
};

export default LogChart;
