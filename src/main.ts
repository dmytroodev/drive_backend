import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('VrealSoft Drive')
    .setDescription('DOcumentation for VrealSoft Drive API')
    .setVersion('1.0')
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  if (!existsSync('uploads')) {
    mkdirSync('uploads', { recursive: true });
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
