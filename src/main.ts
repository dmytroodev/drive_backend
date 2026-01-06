import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  if (!existsSync('uploads')) {
    mkdirSync('uploads', { recursive: true });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
