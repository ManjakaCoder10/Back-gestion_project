import { Controller, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '../entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly TaskService: TaskService) {}

  @Get('graphe')
  async getTask(
 
  ): Promise<Task[]> {
    
    return this.TaskService.getTask();
  }
}
