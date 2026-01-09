import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.client';
import { rmSync, existsSync } from 'fs';

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

  async remove(userId: string, fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    })

    if (!file) {
      throw new NotFoundException('File not found')
    }

    if (file.ownerId !== userId) {
      throw new ForbiddenException()
    }

    if (existsSync(file.path)) {
      try {
        rmSync(file.path)
      } catch (e) {
        // 
      }
    }

    await this.prisma.file.delete({
      where: { id: fileId },
    })

    return { success: true }
  }
}
