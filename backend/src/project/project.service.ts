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
  
    // Vérifier si un ID de projet est fourni pour la mise à jour
    if (createProjectDto.id) {
      project = await this.projectRepository.findOne({
        where: { project_id: createProjectDto.id },
        relations: ['tasks'],
      });
  
      if (!project) {
        throw new Error(`Le projet avec l'ID ${createProjectDto.id} n'existe pas`);
      }
  
      // Mise à jour des informations du projet
      project.project_name = createProjectDto.nomProjet;
      project.description = createProjectDto.description;
      project.start_date = createProjectDto.dateDebut;
      project.end_date = createProjectDto.dateFin;
  
      // Sauvegarder le projet mis à jour
      const savedProject = await this.projectRepository.save(project);
  
      // Traiter les tâches du projet
      const updatedTasks = createProjectDto.taches.map((tache) => {
        const task = project.tasks.find((t) => t.task_id === tache.taskid) || new Task();
        task.task_name = tache.nom;
        task.deadline = tache.deadline;
        task.userUserId = tache.id;
        task.description = tache.description || createProjectDto.description;
        task.project = savedProject;
        return task;
      });
  
      // Supprimer les tâches qui ne sont plus présentes
      const taskIdsToKeep = createProjectDto.taches.map((t) => t.taskid).filter(Boolean);
      const tasksToDelete = project.tasks.filter(
        (existingTask) => !taskIdsToKeep.includes(existingTask.task_id)
      );
      await this.taskRepository.remove(tasksToDelete);
  
      // Sauvegarder les nouvelles et mises à jour des tâches
      await this.taskRepository.save(updatedTasks);
  
      // Envoyer un e-mail aux utilisateurs assignés aux nouvelles tâches
      for (const task of updatedTasks) {
        const user = await this.userRepository.findOne({ where: { user_id: task.userUserId } });
        if (user) {
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Assignation de tâche',
            text: `Bonjour ${user.name},\n\nVous avez une nouvelle tâche assignée : ${task.task_name} avec une date limite le ${task.deadline}.\n\nDescription : ${task.description}`,
          });
        }
      }
  
      // Notifier la mise à jour des tâches via le service d'événements
      this.eventsGateway.handleEntityUpdate('task', { project: savedProject });
      return savedProject;
    } else {
      // Création d'un nouveau projet si aucun ID n'est fourni
      project = new Project();
      project.project_name = createProjectDto.nomProjet;
      project.description = createProjectDto.description;
      project.start_date = createProjectDto.dateDebut;
      project.end_date = createProjectDto.dateFin;
  
      const savedProject = await this.projectRepository.save(project);
  
      // Création des tâches pour le nouveau projet
      const tasks = createProjectDto.taches.map((tache) => {
        const task = new Task();
        task.task_name = tache.nom;
        task.deadline = tache.deadline;
        task.userUserId = tache.id;
        task.description = tache.description || createProjectDto.description;
        task.project = savedProject;
        return task;
      });
      await this.taskRepository.save(tasks);
  
      // Envoyer un e-mail aux utilisateurs assignés
      for (const task of tasks) {
        const user = await this.userRepository.findOne({ where: { user_id: task.userUserId } });
        if (user) {
          await this.mailerService.sendMail({
            to: user.email,
            subject: 'Assignation de tâche',
            text: `Bonjour ${user.name},\n\nVous avez une nouvelle tâche assignée : ${task.task_name} avec une date limite le ${task.deadline}.\n\nDescription : ${task.description}`,
          });
        }
      }
  
      // Notifier la création des tâches via le service d'événements
      this.eventsGateway.handleEntityUpdate('task', { project: savedProject });
      return savedProject;
    }
  }
  


 /* async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
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
      let descriptionT=createProjectDto.description;
  
      const savedProject = await this.projectRepository.save(project);
  
      for (const tache of createProjectDto.taches) {
        let existingTask = await this.taskRepository.findOne({
          where: { task_name: tache.nom, project: savedProject }
        });
  
        if (existingTask) {
          existingTask.deadline = tache.deadline;
          existingTask.userUserId = tache.id;
          existingTask.description = descriptionT;
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
      let descriptionT=createProjectDto.description;
  
      const savedProject = await this.projectRepository.save(project);
  
      for (const tache of createProjectDto.taches) {
        const task = new Task();
        task.task_name = tache.nom;
        task.deadline = tache.deadline;
        task.userUserId = tache.id;
        task.description =  descriptionT;
        task.project = savedProject;
  
        await this.taskRepository.save(task);
  
        let user = await this.userRepository.findOne({ where: { user_id: tache.id} });
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
  */
/*  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
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
  
*/







  

   
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
