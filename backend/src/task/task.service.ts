import { Injectable ,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../entities/task.entity';


@Injectable()
export class TaskService {
  constructor(
   
    @InjectRepository(Task)
    private TaskRepository: Repository<Task>,
  ) {}


  async getTask(): Promise<Task[]> {
    const task = await this.TaskRepository.createQueryBuilder('tasj')
      .getMany(); 

    return task;
}




}









  

 
