import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 /* // Configurer CORS
  app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre application Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous avez besoin d'envoyer des cookies
  }));*/

  await app.listen(3001); // Le port sur lequel NestJS écoute
}
bootstrap();
