import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Remplacez par l'origine de votre application front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous avez besoin d'envoyer des cookies ou des headers d'autorisation
  });

  await app.listen(3001);
}
bootstrap();
