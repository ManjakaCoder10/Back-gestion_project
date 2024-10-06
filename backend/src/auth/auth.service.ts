import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    // Requête à la base de données pour vérifier les informations
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
      return user; // Mot de passe correct
    }
    return null; // Mot de passe incorrect
  }
}
