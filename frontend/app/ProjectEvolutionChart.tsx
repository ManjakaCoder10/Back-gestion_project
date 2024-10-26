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

ChartJS.register(CategoryScale, TimeScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

interface Task {
    task_name: string;
    deadline: string;
}

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

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            setChartData(null);
            return;
        }

        const datasets: any[] = [];

        projects.forEach((project, projectIndex) => {
            // Ligne pour la durée du projet
            const projectLineData = [
                { x: new Date(project.start_date), y: projectIndex + 1 },
                { x: new Date(project.end_date), y: projectIndex + 1 }
            ];

            datasets.push({
                type: 'line',
                label: `Projet: ${project.project_name}`,
                data: projectLineData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                fill: false,
                tension: 0.3,
                pointRadius: 5,
                borderWidth: 2,
            });

            // Barres pour les tâches du projet avec positionnement unique en y
            const taskData = project.tasks.map((task, taskIndex) => ({
                x: new Date(task.deadline),
                y: projectIndex + 1 + taskIndex * 0.1, // Position légèrement décalée pour éviter le chevauchement
                task_name: task.task_name
            }));

            datasets.push({
                type: 'bar',
                label: `Tâches de ${project.project_name}`,
                data: taskData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 8,
            });
        });

        setChartData({ datasets });
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
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const taskName = context.raw.task_name;
                        return taskName ? `Tâche: ${taskName}` : context.dataset.label;
                    }
                }
            }
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
                type: 'linear',
                position: 'left',
                ticks: {
                    stepSize: 1,
                    callback: function(value, index) {
                        const project = projects[Math.floor(value - 1)];
                        return project ? project.project_name : '';
                    },
                },
                title: {
                    display: true,
                    text: 'Projets',
                },
            },
        },
    }), [projects]);

    return (
        <div style={{ height: '600px', width: '100%' }}>
            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Aucune donnée de projet à afficher</p>
            )}
        </div>
    );
};

export default ProjectEvolutionChart;
