import { Controller, Get, Post,Body,Param, ParseIntPipe, Delete,Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { CreateUsertDto } from './create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint pour récupérer les utilisateurs disponibles pour un projet et une date limite
  @Get('available/project')
  async getAvailableUsersForProjectAndDeadline(
 
  ): Promise<User[]> {
    
    return this.userService.getAvailableUsersForProjectAndDeadline();
  }
  @Post()
  async createUser(@Body() CreateUsertDto: CreateUsertDto) {
    return this.userService.createUser(CreateUsertDto);
  }
 

  // Endpoint pour récupérer les utilisateurs disponibles pour le mois en cours
  @Get('available/month')
  async getAvailableUsersForMonth(): Promise<User[]> {
    return this.userService.getAvailableUsersForMonth();
  }
  @Get('available/user-all')
  async getAvailableUser(): Promise<User[]> {
    return this.userService.getAvailableUsers();
  }

  @Post('create-or-update-user')
async createOrUpdateUser(@Body() createUserDto: CreateUsertDto): Promise<User> {
  // Appel au service avec les données du DTO
  return this.userService.createUser(createUserDto);
}

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

}
