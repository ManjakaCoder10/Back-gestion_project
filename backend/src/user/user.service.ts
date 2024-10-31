import { Injectable ,NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Task } from '../entities/task.entity';
import { CreateUsertDto } from './create-user.dto';
import { EventsGateway } from '../events/events.gateway';
interface CreateEmailDto {
  email: string;
  subject: string;
  message: string;
}
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private mailerService: MailerService,
    private eventsGateway: EventsGateway,

  ) {}


  async getAvailableUsersForProjectAndDeadline(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder('user')
      .getMany(); 

    return users;
}



async createUser(createUserDto: CreateUsertDto): Promise<User> {
  let user: User;

 
  if (createUserDto.id) {

    user = await this.userRepository.findOne({ where: { user_id: createUserDto.id } });
    if (!user) {
      throw new Error(`L'utilisateur avec l'ID ${createUserDto.id} n'existe pas`);
    }
  } else {
  
    user = new User();
  }

 
  user.name = createUserDto.nom;
  user.email = createUserDto.email;
  user.role = createUserDto.role;
  user.password = createUserDto.password;


  const savedUser = await this.userRepository.save(user);

  await this.mailerService.sendMail({
    to: user.email,
    subject: 'Bienvenue sur notre plateforme',
    text: `Bonjour ${user.name},\n\nVotre compte a été créé avec succès !\nVotre mot de passe est : ${user.password}\n\nCordialement,\nL'équipe.`,
  });
  this.eventsGateway.handleEntityUpdate('user', { user: savedUser });
  return savedUser;
}





 async deleteUser(id: number): Promise<void> {
  
    const user = await this.userRepository.findOne({
      where: {user_id : id },
      relations: ['tasks'],
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }

 
    await this.taskRepository.delete({ user });


    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} introuvable`);
    }
  }





  async getAvailableUsersForMonth(): Promise<User[]> {
    const currentMonth = new Date().getMonth() + 1; 
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

  async getAvailableUsers(): Promise<User[]> {
   

    const availableUsers = await this.userRepository
      .createQueryBuilder('user')
    
      .getMany();

    return availableUsers;
  }
  async getTaskByUserId(userId: string): Promise<User[]> {
    const tasks = await this.userRepository.createQueryBuilder('user')
      .where('user.user_id = :userId', { userId }) // Filtre par userId
      .getMany();
  
    return tasks;
  }
  async send_email(createEmailDto: CreateEmailDto) {
    const { email, subject, message } = createEmailDto;


    await this.mailerService.sendMail({
      to: "fanomezantsoamanjakatsilavina@gmail.com",
      subject: subject,
      text: message +"voici mon son email"+ email,
    });

    return { message: 'Email envoyé avec succès' };
  }
}
