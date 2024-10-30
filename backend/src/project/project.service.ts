import { Injectable ,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { CreateProjectDto } from './create-project.dto';
import { User } from '../entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailerService: MailerService,
    private eventsGateway: EventsGateway,
  ) {}

 

 

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    let project: Project;
    
    if (createProjectDto.id) {
      project = await this.projectRepository.findOne({ where: { project_id: createProjectDto.id }, relations: ['tasks'] });
  
      if (!project) {
        throw new Error(`Le projet avec l'ID ${createProjectDto.id} n'existe pas`);
      }
  

      project.project_name = createProjectDto.nomProjet;
      project.description = createProjectDto.description;
      project.start_date = createProjectDto.dateDebut;
      project.end_date = createProjectDto.dateFin;
  
      const savedProject = await this.projectRepository.save(project);
  
     
      for (const tache of createProjectDto.taches) {
        
        let existingTask = await this.taskRepository.findOne({ 
          where: { task_name: tache.nom, project: savedProject }
        });
  
        if (existingTask) {
   
          existingTask.deadline = tache.deadline;
          existingTask.userUserId = tache.id;
          existingTask.description = tache.description;
          await this.taskRepository.save(existingTask);
   
        } else {
         
          const newTask = new Task();
          newTask.task_name = tache.nom;
          newTask.deadline = tache.deadline;
          newTask.userUserId = tache.id;
          newTask.description = tache.description;
          newTask.project = savedProject;
  
          await this.taskRepository.save(newTask);
          let user = await this.userRepository.findOne({ where: { user_id: tache.id } });
          if (user) {
          
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'assignation tâche',
      text: `Bonjour ${user.name},\n\nVous avez une nouvelle tâche assignée: ${tache.nom} avec une date limite le ${tache.deadline}.\n\nDescription: ${tache.description}`,
    });
          }
        }
      }
      this.eventsGateway.handleEntityUpdate('task', { project: savedProject });
      return savedProject;
    } else {
   
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
     
        let user = await this.userRepository.findOne({ where: { user_id: tache.id } });
        if (user) {
        
  await this.mailerService.sendMail({
    to: user.email,
    subject: 'assignation tâche',
    text: `Bonjour ${user.name},\n\nVous avez une nouvelle tâche assignée: ${tache.nom} avec une date limite le ${tache.deadline}.\n\nDescription: ${tache.description}`,
  });
        }
      
      }
      this.eventsGateway.handleEntityUpdate('task', { project: savedProject });
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
        .leftJoinAndSelect('Project.tasks', 'Task')   
        .leftJoinAndSelect('Task.user', 'User')       
        .getMany();

    return projects;
}


}
