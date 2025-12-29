import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.client';
import { AuthModule } from './auth/auth.module';
import { FoldersModule } from './folders/folders.module';

@Module({
  imports: [AuthModule, FoldersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
