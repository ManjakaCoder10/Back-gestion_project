import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { CreateProjectDto } from './create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.  project_name = createProjectDto.nomProjet;
    project.description = createProjectDto.description;
    project.start_date = createProjectDto.dateDebut;
    project. end_date = createProjectDto.dateFin;

    const savedProject = await this.projectRepository.save(project);

    for (const tache of createProjectDto.taches) {
      const task = new Task();
      task. task_name = tache.nom;
    
  
      task.deadline = tache.deadline;
      task.userUserId=tache.id;
      task.description = tache.description;
   
      task.project = savedProject;
      await this.taskRepository.save(task);
    }

    return savedProject;
  }
  async tableProject(): Promise<Project[]> {
    const Project = await this.projectRepository.createQueryBuilder('Project')
      .getMany(); 

    return Project;
}
}
