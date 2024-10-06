// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])], // Importation des entités User et Task
  providers: [UserService], // Ajout du UserService en tant que fournisseur
  controllers: [UserController], // Ajout du UserController
})
export class UserModule {}
