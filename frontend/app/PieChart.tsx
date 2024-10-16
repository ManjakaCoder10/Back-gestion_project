
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
          '#FF6384', 
          '#36A2EB', 
          '#FFCE56'  
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }
    ]
  };

  return <Pie data={pieData} />;
};

export default UserPieChart;
