import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Méthode pour récupérer les utilisateurs non assignés à un projet ou à des tâches avec une deadline
  async getAvailableUsersForProjectAndDeadline(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder('user')
      .getMany(); // Récupère tous les utilisateurs sans conditions

    return users;
}


  // Méthode pour récupérer les utilisateurs disponibles pour le mois en cours
  async getAvailableUsersForMonth(): Promise<User[]> {
    const currentMonth = new Date().getMonth() + 1; // Mois actuel (de 0 à 11)
    const currentYear = new Date().getFullYear();

    const availableUsers = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.tasks', 'task')
      .where(
        `(task.task_id IS NULL OR MONTH(task.deadline) != :currentMonth OR YEAR(task.deadline) != :currentYear)`,
        { currentMonth, currentYear },
      )
      .getMany();

    return availableUsers;
  }
}
