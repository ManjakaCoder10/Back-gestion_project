import React, { useEffect, useState, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    TimeScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Enregistrement des composants de Chart.js
ChartJS.register(CategoryScale, TimeScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

// Interfaces pour les tâches et les projets
interface Task {
    task_name: string;
    deadline: string;
}

const normalizeTaskName = (name: string) => name.trim().toLowerCase();

interface Project {
    project_id: number;
    project_name: string;
    start_date: string;
    end_date: string;
    tasks: Task[];
}

interface ProjectEvolutionChartProps {
    projects: Project[];
}

const ProjectEvolutionChart: React.FC<ProjectEvolutionChartProps> = ({ projects }) => {
    const [chartData, setChartData] = useState<any>(null);
    const [uniqueTaskNames, setUniqueTaskNames] = useState<string[]>([]);

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            setChartData(null);
            setUniqueTaskNames([]);
            return;
        }

        // Extraire les noms de tâches uniques
        const taskNamesSet = new Set(
            projects.flatMap(project => project.tasks.map(task => normalizeTaskName(task.task_name)))
        );
        const taskNamesArray = Array.from(taskNamesSet);
        setUniqueTaskNames(taskNamesArray);

        const datasets: any[] = [];

        // Ajout des tâches en tant que barres pour chaque projet
        projects.forEach((project) => {
            const taskData = project.tasks.map((task) => {
                const normalizedTaskName = normalizeTaskName(task.task_name);
                const yIndex = taskNamesArray.indexOf(normalizedTaskName); // Utiliser l'index dans uniqueTaskNames
                return task.deadline && yIndex !== -1 ? {
                    x: new Date(task.deadline), // La date de la deadline de la tâche
                    y: yIndex, // Utiliser l'index du nom de la tâche comme position sur l'axe Y
                } : null;
            }).filter(Boolean); // Supprimer les valeurs nulles

            if (taskData.length > 0) {
                datasets.push({
                    type: 'bar',
                    label: `Tâches de ${project.project_name}`,
                    data: taskData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barThickness: 12,
                });
            }
        });

        // Ajout des projets en tant que lignes (représentant la durée du projet)
        projects.forEach((project) => {
            datasets.push({
                type: 'line',
                label: `Projet ${project.project_name}`,
                data: [
                    { x: new Date(project.start_date), y: -1 }, // Utiliser -1 pour les projets (en dehors des tâches)
                    { x: new Date(project.end_date), y: -1 },
                ],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: false,
                tension: 0.3,
                pointRadius: 5,
            });
        });

        setChartData({
            datasets,
        });
    }, [projects]);

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Évolution des projets et des tâches',
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMM dd, yyyy',
                    displayFormats: {
                        day: 'MMM dd',
                    },
                },
                title: {
                    display: true,
                    text: 'Dates',
                },
            },
            y: {
                type: 'category',
                labels: ['Projets', ...uniqueTaskNames], // "Projets" comme première catégorie, puis les tâches
                title: {
                    display: true,
                    text: 'Tâches et Projets',
                },
            },
        },
    }), [uniqueTaskNames]);

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
