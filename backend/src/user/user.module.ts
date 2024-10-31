// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task])], 
  providers: [UserService], 
  controllers: [UserController,,EventsGateway],
})
export class UserModule {}
