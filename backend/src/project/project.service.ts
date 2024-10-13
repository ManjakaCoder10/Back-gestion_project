import { Injectable ,NotFoundException  } from '@nestjs/common';
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
    let project: Project;
    let task : Task;
  
    // Vérification de l'existence du projet par ID ou autre critère
    if (createProjectDto.id) {
      project = await this.projectRepository.findOne({ where: { project_id: createProjectDto.id } });
      
      if (!project) {
        throw new Error(`Le projet avec l'ID ${createProjectDto.id} n'existe pas`);
      }
        // Mise à jour des champs du projet
    project.project_name = createProjectDto.nomProjet;
    project.description = createProjectDto.description;
    project.start_date = createProjectDto.dateDebut;
    project.end_date = createProjectDto.dateFin;
  
  
    const savedProject = await this.projectRepository.save(project);
  
    // Gestion des tâches
    for (const tache of createProjectDto.taches) {

      task.task_name = tache.nom;
      task.deadline = tache.deadline;
      task.userUserId = tache.id;
      task.description = tache.description;
      task.project = savedProject;
  
     
      await this.taskRepository.save(task);
    }
  
    return savedProject;
    } else {
      // Créer un nouveau projet si aucun ID n'est fourni
      project = new Project();

      project.project_name = createProjectDto.nomProjet;
      project.description = createProjectDto.description;
      project.start_date = createProjectDto.dateDebut;
      project.end_date = createProjectDto.dateFin;

      const savedProject = await this.projectRepository.save(project);


      for (const tache of createProjectDto.taches) {
        const task = new Task();
        task.task_name = tache.nom;
        task.deadline = tache.deadline;
        task.userUserId = tache.id;
        task.description = tache.description;
        task.project = savedProject;
    
       
        await this.taskRepository.save(task);
      }
    

      return savedProject;
    }
  
  }
  

   
  async deleteProject(id: number): Promise<void> {
  
    const project = await this.projectRepository.findOne({
      where: {project_id : id },
      relations: ['tasks'],
    });

    if (!project) {
      throw new NotFoundException(`project avec l'ID ${id} introuvable`);
    }

 
    await this.taskRepository.delete({ project });


    const result = await this.projectRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }













  async tableProject(): Promise<Project[]> {
    const projects = await this.projectRepository.createQueryBuilder('Project')
        .leftJoinAndSelect('Project.tasks', 'Task')   // Joindre les tâches associées aux projets
        .leftJoinAndSelect('Task.user', 'User')       // Joindre les utilisateurs associés aux tâches
        .getMany();

    return projects;
}


}
