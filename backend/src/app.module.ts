import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { NotificationsModule } from './notifications/notifications.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'gestion_projet',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'fanomezantsoamanjakatsilavina@gmail.com', 
          pass: 'ydvp cpqt xydl cayp', 
        },
      },
      defaults: {
        from: '"No Reply" <noreply@votredomaine.com>',
      },
    }),
    AuthModule,
    UserModule,
    TaskModule,
    ProjectModule,
    NotificationsModule,
  ],
})
export class AppModule {}
