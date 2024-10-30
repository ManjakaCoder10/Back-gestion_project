import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { User } from '../entities/user.entity';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task,User])],
  controllers: [ProjectController],
  providers: [ProjectService,EventsGateway],
})
export class ProjectModule {}
