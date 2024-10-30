import { Injectable ,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsGateway } from '../events/events.gateway';

import { Task } from '../entities/task.entity';


@Injectable()
export class TaskService {
  constructor(
   
    @InjectRepository(Task)
    private TaskRepository: Repository<Task>,
  
  ) {}


  async getTask(): Promise<Task[]> {
    const task = await this.TaskRepository.createQueryBuilder('task')
      .getMany(); 

    return task;
}

async getTaskByUserId(userId: string): Promise<Task[]> {
  const tasks = await this.TaskRepository.createQueryBuilder('task')
    .where('task.userUserId = :userId', { userId }) // Filtre par userId
    .getMany();

  return tasks;
}




}









  

 
