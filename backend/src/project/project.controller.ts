import { Controller, Get, Post,Body,Param, ParseIntPipe, Delete,Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './create-project.dto';
import { Project } from '../entities/project.entity';

@Controller('projet')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }
 
  @Get('liste/table_project')
  async tableProject(
 
  ): Promise<Project[]> {
    
    return this.projectService.tableProject();
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectService.deleteProject(id);
  }


}
/*import React, { useEffect, useState, useMemo } from 'react';
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

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            setChartData(null);
            return;
        }

        const datasets: any[] = [];

        projects.forEach((project, index) => {
            const projectLineData = [
                { x: new Date(project.start_date), y: index },
                { x: new Date(project.end_date), y: index }
            ];

            datasets.push({
                type: 'line',
                label: `Durée du projet ${project.project_name}`,
                data: projectLineData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: false,
                tension: 0.3,
                pointRadius: 5,
                borderWidth: 2,
            });

            const taskData = project.tasks.map((task) => ({
                x: new Date(task.deadline),
                y: index,
                task_name: task.task_name
            }));

            datasets.push({
                type: 'bar',
                label: `Tâches de ${project.project_name}`,
                data: taskData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 12,
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
                suggestedMin: 0,
                suggestedMax: projects.length - 1,
                ticks: {
                    callback: function(value) {
                        return projects[Math.floor(value)]?.project_name || '';
                    },
                    stepSize: 1,
                    font: {
                        size: 14,
                    },
                    padding: 10,
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
*/


























/*import React, { useEffect, useState, useMemo } from 'react';
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

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            setChartData(null);
            return;
        }

        const datasets: any[] = [];

        // Pour chaque projet, créer une ligne représentant sa durée et des barres pour chaque tâche
        projects.forEach((project, index) => {
            // Crée les données de la ligne du projet avec sa date de début et de fin
            const projectLineData = [
                { x: new Date(project.start_date), y: index },  // Date de début du projet
                { x: new Date(project.end_date), y: index }     // Date de fin du projet
            ];

            datasets.push({
                type: 'line',
                label: `Durée du projet ${project.project_name}`,
                data: projectLineData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                fill: false,
                tension: 0.3,
                pointRadius: 5,
                borderWidth: 2,
            });

            // Ajout des barres de tâches pour chaque projet, représentant les deadlines de chaque tâche
            const taskData = project.tasks.map((task) => ({
                x: new Date(task.deadline),  // Conversion en objet Date
                y: index,
                task_name: task.task_name  // Ajouter le nom de la tâche pour l'affichage dans le tooltip
            }));
  console.log(taskData)
            datasets.push({
                type: 'bar',
                label: `Tâches de ${project.project_name}`,
                data: taskData,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                barThickness: 12,
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
                type: 'category',
                position: 'left',
                suggestedMin: 0,
                suggestedMax: projects.length - 1,
                labels: projects.map((project) => project.project_name),
               
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
*/