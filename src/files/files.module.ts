import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from "../prisma.client";
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const unique = Date.now() + '-' + Math.random().toString(36).slice(2);
          cb(null, `${unique}-${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
