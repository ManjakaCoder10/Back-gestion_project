import { Chart as ChartJS, CategoryScale, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import 'chartjs-adapter-date-fns'; // Importer l'adaptateur de date

ChartJS.register(CategoryScale, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
    task_name: string;
    deadline: string; // La deadline doit être au format ISO 8601
}

interface Project {
    project_id: number;
    project_name: string;
    end_date: string; // Date de fin du projet au format ISO 8601
    Task?: Task[]; // La propriété Task est optionnelle
}

interface ProjectEvolutionChartProps {
    projects: Project[];
}

const ProjectEvolutionChart: React.FC<ProjectEvolutionChartProps> = ({ projects }) => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            setChartData(null);
            return;
        }

        const datasets = [];

        // Obtenir toutes les deadlines
        projects.forEach((project) => {
            const deadlines = (project.Task || []).map(task => {
                const date = new Date(task.deadline);
                return {
                    x: date, // Utiliser la date comme x
                    y: 1, // Valeur pour l'axe y, vous pouvez ajuster cette valeur comme nécessaire
                };
            });

            // Ajouter la date de fin du projet
            const endDate = new Date(project.end_date);
            deadlines.push({
                x: endDate,
                y: 1,
            });

            datasets.push({
                label: `Deadlines du projet ${project.project_name}`,
                data: deadlines,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                barPercentage: 0.5,
                categoryPercentage: 0.5,
            });
        });

        setChartData({
            datasets,
        });
    }, [projects]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Évolution des projets et des tâches (par deadline)',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day', // Unité à afficher
                    tooltipFormat: 'MMM dd, yyyy', // Format de l'info-bulle
                    displayFormats: {
                        day: 'MMM dd', // Format de l'affichage
                    },
                },
            },
            y: {
                beginAtZero: true,
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
