import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from 'src/prisma.client';
import { rmSync } from 'fs';
import type { Breadcrumb } from './types';

@Injectable()
export class FoldersService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, dto: CreateFolderDto) {
    return this.prisma.folder.create({
      data: {
        name: dto.name,
        parentId: dto.parentId ?? null,
        ownerId: userId,
        isPublic: dto.isPublic
      },
    });
  }

  findAll(userId: string, parentId?: string | null) {
    const normalizedParentId =
    parentId === 'null' || parentId === undefined
      ? null
      : parentId

    return this.prisma.folder.findMany({
      where: {
        ownerId: userId,
        parentId: normalizedParentId,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getBreadcrumbs(folderId: string) {
    const path: Breadcrumb[] = []

    let current = await this.prisma.folder.findUnique({
      where: { id: folderId },
    });

    while (current) {
      path.unshift({ id: current.id, name: current.name });

      if (!current.parentId) break

      current = await this.prisma.folder.findUnique({
        where: { id: current.parentId },
      });
    }

    return path
  } 

  async update(userId: string, id: string, dto: UpdateFolderDto) {
    const folder = await this.prisma.folder.findUnique({ where: { id } });

    if (!folder || folder.ownerId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.folder.update({
      where: { id },
      data: { 
        name: dto.name, 
        isPublic: dto.isPublic 
      },
    });
  }

  async remove(userId: string, id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
    })

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.ownerId !== userId) {
      throw new ForbiddenException()
    }

    const folderIds = await this.collectFolderIds(id)

    const files = await this.prisma.file.findMany({
      where: {
        folderId: { in: folderIds },
        ownerId: userId,
      },
    })

    for (const file of files) {
      try {
        rmSync(file.path, { force: true })
      } catch {}
    }

    await this.prisma.folder.delete({
      where: { id }
    })

    return { success: true }
  }

  private async collectFolderIds(folderId: string): Promise<string[]> {
    const children = await this.prisma.folder.findMany({
      where: { parentId: folderId },
      select: { id: true },
    })

    const ids = [folderId]

    for (const child of children) {
      ids.push(...(await this.collectFolderIds(child.id)))
    }

    return ids
  }
}
