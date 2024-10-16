import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface TaskEvolutionChartProps {
  completedTasks: number[];
  pendingTasks: number[];
}

const TaskEvolutionChart: React.FC<TaskEvolutionChartProps> = ({ completedTasks, pendingTasks }) => {
  const labels = Array.from({ length: 30 }, (_, i) => `Jour ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: 'Tâches terminées',
        data: completedTasks,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
        fill: true,
      },
      {
        label: 'Tâches non terminées',
        data: pendingTasks,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y2',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des tâches (sur 30 jours)',
      },
    },
    scales: {
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default TaskEvolutionChart;
