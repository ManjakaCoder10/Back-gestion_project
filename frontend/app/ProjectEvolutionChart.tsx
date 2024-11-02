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
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 2,
            });

            const taskData = project.tasks.map((task, taskIndex) => ({
                x: new Date(task.deadline),
                y: projectIndex + 1 + taskIndex * 0.1,
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
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.7)',
            });
        });

        setChartData({ datasets });
    }, [projects]);

    const options = useMemo(() => ({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                        weight: 'bold',
                    }
                }
            },
            title: {
                display: true,
                text: 'Évolution des projets et des tâches',
                color: '#444',
                font: {
                    size: 18,
                    weight: 'bold',
                }
            },
            tooltip: {
                backgroundColor: '#222',
                bodyColor: '#fff',
                titleColor: '#fff',
                borderWidth: 1,
                borderColor: '#ddd',
                callbacks: {
                    label: function(context: any) {
                        const taskName = context.raw.task_name;
                        return taskName ? `Tâche: ${taskName}` : context.dataset.label;
                    }
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutElastic',
           
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
                    color: '#444',
                    font: {
                        size: 16,
                        weight: 'bold',
                    }
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
                    color: '#444',
                    font: {
                        size: 16,
                        weight: 'bold',
                    }
                },
            },
        },
    }), [projects]);

    return (
        <div style={{ height: '600px', width: '100%' }} className="fade-in">
            {chartData ? (
                <Bar data={chartData} options={options} />
            ) : (
                <p>Aucune donnée de projet à afficher</p>
            )}
        </div>
    );
};

export default ProjectEvolutionChart;
