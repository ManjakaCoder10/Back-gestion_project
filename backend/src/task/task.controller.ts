import { Controller, Get, Query,Body, HttpException, HttpStatus } from '@nestjs/common';
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
  @Get('assigned')
  async getTaskByUserId(@Query('userId') userId: string): Promise<Task[]> {
    console.log("Requête pour userId :", userId); // pour vérifier si userId est reçu
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }
    return this.TaskService.getTaskByUserId(userId);
  }
  
}
