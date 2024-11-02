import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface User {
  name: string;
  role: string; 
}

interface UserPieChartProps {
  users: User[];
}

const UserPieChart: React.FC<UserPieChartProps> = ({ users }) => {
  const devCount = users.filter(user => user.role === 'développeur').length;
  const designerCount = users.filter(user => user.role === 'designer').length;
  const concepteurCount = users.filter(user => user.role === 'concepteur').length;

  const pieData = {
    labels: ['Développeurs', 'Designers', 'Concepteurs'],
    datasets: [
      {
        label: 'Utilisateurs par rôle',
        data: [devCount, designerCount, concepteurCount], 
        backgroundColor: [
          '#FF6384', // Rose pour développeurs
          '#36A2EB', // Bleu pour designers
          '#FFCE56'  // Jaune pour concepteurs
        ],
        hoverBackgroundColor: [
          '#FF497D',
          '#2D91D7',
          '#F4B400'
        ],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#444',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#fff',
        titleColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd'
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: 'easeOutBounce'
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg fade-in">
      <h2 className="text-2xl font-bold mb-4 text-blue-500 text-center">Distribution des rôles</h2>
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default UserPieChart;
