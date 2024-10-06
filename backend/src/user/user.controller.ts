import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint pour récupérer les utilisateurs disponibles pour un projet et une date limite
  @Get('available/project')
  async getAvailableUsersForProjectAndDeadline(
 
  ): Promise<User[]> {
    
    return this.userService.getAvailableUsersForProjectAndDeadline();
  }

  // Endpoint pour récupérer les utilisateurs disponibles pour le mois en cours
  @Get('available/month')
  async getAvailableUsersForMonth(): Promise<User[]> {
    return this.userService.getAvailableUsersForMonth();
  }
}
