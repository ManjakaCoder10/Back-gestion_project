import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
    task_name: string;
    deadline: string; 
}

interface Project {
    project_id: number;
    project_name: string;
    end_date: string;
    Task: Task[];
}

interface ProjectEvolutionChartProps {
    projects: Project[];
}

const ProjectEvolutionChart: React.FC<ProjectEvolutionChartProps> = ({ projects }) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        // Vérification si projects est un tableau et non vide
        if (!Array.isArray(projects) || projects.length === 0) {
            console.error("Aucun projet disponible");
            setChartData(null);
            return;
        }

        // Récupérer les noms des projets
        const projectNames = projects.map((project) => project.project_name);

        // Créer les datasets pour les tâches de chaque projet
        const datasets = projects.map((project) => ({
            label: `Deadlines du projet ${project.project_name}`,
            data: Array.isArray(project.Task)
                ? project.Task.map(task => new Date(task.deadline).getTime()) // Conversion des deadlines en timestamps
                : [], // Si Task n'est pas un tableau, retourner un tableau vide
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // Couleur uniforme pour toutes les barres
            barPercentage: 0.5,
            categoryPercentage: 0.5,
        }));

 
        if (datasets.length > 0) {
            setChartData({
                labels: projectNames,
                datasets,
            });
        } else {
            console.error("Aucun dataset disponible");
            setChartData(null);
        }
    }, [projects]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Évolution des projets et des tâches (par deadline)',
            },
        },
        scales: {
            x: {
                type: 'category',
            },
            y: {
                beginAtZero: false, // Les timestamps ne commencent pas à 0
                ticks: {
                    callback: function (value) {
                        const date = new Date(value as number); // Transformer le timestamp en date
                        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`; // Afficher la date et l'heure
                    },
                },
            },
        },
    };

    return (
        <div>
            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Aucune donnée de projet à afficher</p>
            )}
        </div>
    );
};

export default ProjectEvolutionChart;
