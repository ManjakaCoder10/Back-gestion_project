import { Controller, Get, Post,Body,Param, ParseIntPipe, Delete,Query } from '@nestjs/common';
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

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectService.deleteProject(id);
  }


}
