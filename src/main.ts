import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'https://ethan-chiu.github.io',
    ],
  });
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
