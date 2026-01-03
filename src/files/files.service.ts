import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.client';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async create({
    file,
    userId,
    folderId,
    isPublic
  }: {
    file: Express.Multer.File;
    userId: string;
    folderId?: string | null;
    isPublic
  }) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    return this.prisma.file.create({
      data: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        ownerId: userId,
        folderId: folderId ?? null,
        isPublic: isPublic ?? false,
      },
    })
  }

  findAll(userId: string, folderId: string | null | undefined) {
    return this.prisma.file.findMany({
      where: {
        ownerId: userId,
        folderId,
      },
      orderBy: { createdAt: 'asc' },
    })
  }
}
