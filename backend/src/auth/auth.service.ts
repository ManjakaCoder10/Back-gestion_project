// auth.service.ts
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

  async validateUser(email: string, password: string): Promise<{ user: { id: number }; isAdmin: boolean } | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
      const isAdmin = user.role === 'admin';
      return { user: { id: user.user_id }, isAdmin }; 
    }
    return null;
  }
}
