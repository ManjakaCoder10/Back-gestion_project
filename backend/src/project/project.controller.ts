import { Controller, Post,Get, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './create-project.dto';
import { Project } from '../entities/project.entity';

@Controller('projet')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }
 
  @Get('liste/table_project')
  async tableProject(
 
  ): Promise<Project[]> {
    
    return this.projectService.tableProject();
  }


}
