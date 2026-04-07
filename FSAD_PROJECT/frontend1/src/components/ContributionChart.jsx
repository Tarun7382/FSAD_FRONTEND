import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['John Doe', 'Jane Smith'],
  datasets: [{
    label: 'Contributions',
    data: [75, 60],
    backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)'],
    borderColor: ['rgba(52, 152, 219, 1)', 'rgba(46, 204, 113, 1)'],
    borderWidth: 1,
  }],
};

const options = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Percentage' },
    },
    x: {
      title: { display: true, text: 'Politicians' },
    },
  },
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true }
  },
  maintainAspectRatio: false,
};

function ContributionChart() {
  return (
    <div style={{height: 300}}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ContributionChart;
