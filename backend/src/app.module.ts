import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module'; // Ajoutez ce module pour les projets

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_projet',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Charge toutes les entités
      synchronize: true, // Ne pas activer en production
    }),
    AuthModule,
    UserModule,TaskModule,
    ProjectModule, // Ajoutez le module des projets
  ],
})
export class AppModule {}
