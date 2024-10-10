import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  task_id: number;
  @Column({ type: 'int' })
  userUserId: number;

  @Column()
  task_name: string;

  @Column({ type: String})
  description: string;

  @Column({ default: 'en cours' })
  status: string;

  @Column({ nullable: true })
  deadline: Date;

  @ManyToOne(() => User, (user) => user.tasks  ,{ onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Project, (project) => project.tasks ,{ onDelete: 'CASCADE' })
  project: Project;
}