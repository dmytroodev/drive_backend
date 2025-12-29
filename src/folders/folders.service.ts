import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from 'src/prisma.client';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: {
        name: dto.name,
        parentId: dto.parentId ?? null,
        ownerId: userId,
      },
    });
  }

  findAll(userId: string, parentId?: string | null) {
    return this.prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: parentId ?? null,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(userId: string, id: string, dto: UpdateFolderDto) {
    const folder = await this.prisma.folder.findUnique({ where: { id } });

    if (!folder || folder.ownerId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.folder.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(userId: string, id: string) {
    const folder = await this.prisma.folder.findUnique({ where: { id } });

    if (!folder || folder.ownerId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.folder.delete({ where: { id } });
  }
}
