import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.client';
import { CreatePermissionsDto } from './dto/create-permission.dto';
import { AccessType, ResourceType } from '../generated/prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async createPermissions(
    currentUserId: string,
    dto: CreatePermissionsDto
  ) {
    const resource =
      dto.resourceType === ResourceType.folder
        ? await this.prisma.folder.findUnique({
            where: { id: dto.resourceId }
          })
        : await this.prisma.file.findUnique({
            where: { id: dto.resourceId }
          });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (resource.ownerId !== currentUserId) {
      throw new ForbiddenException();
    }

    const roleToAccessMap: Record<'viewer' | 'editor', AccessType> = {
      viewer: AccessType.read,
      editor: AccessType.write
    };

    const incomingEmails = dto.users.map(u => u.email);

    await this.prisma.permission.deleteMany({
      where: {
        resourceId: dto.resourceId,
        resourceType: dto.resourceType,
        user: {
          email: {
            notIn: incomingEmails
          }
        }
      }
    });

    if (dto.users.length === 0) {
      return { success: true };
    }

    const users = await this.prisma.user.findMany({
      where: {
        email: {
          in: incomingEmails
        }
      }
    });

    const usersByEmail = new Map(
      users.map(user => [user.email, user])
    );

    for (const { email } of dto.users) {
      if (!usersByEmail.has(email)) {
        throw new Error(`User not found: ${email}`);
      }
    }

    for (const user of dto.users) {
      const targetUser = usersByEmail.get(user.email)!;

      if (targetUser.id === currentUserId) continue;

      await this.prisma.permission.upsert({
        where: {
          userId_resourceId_resourceType: {
            userId: targetUser.id,
            resourceId: dto.resourceId,
            resourceType: dto.resourceType
          }
        },
        update: {
          access: roleToAccessMap[user.role]
        },
        create: {
          userId: targetUser.id,
          resourceId: dto.resourceId,
          resourceType: dto.resourceType,
          access: roleToAccessMap[user.role]
        }
      });
    }

    return { success: true };
  }

  private mapAccessToRole(access: AccessType) {
    return access === AccessType.write ? 'editor' : 'viewer';
  }

  async getPermissions(
    currentUserId: string,
    resourceId: string,
    resourceType: ResourceType
  ) {
    const prismaResourceType =
      resourceType === 'folder'
        ? ResourceType.folder
        : ResourceType.file;

    const resource =
      prismaResourceType === ResourceType.folder
        ? await this.prisma.folder.findUnique({
            where: { id: resourceId }
          })
        : await this.prisma.file.findUnique({
            where: { id: resourceId }
          });

    if (!resource) {
      throw new NotFoundException();
    }

    const isOwner = resource.ownerId === currentUserId;

    if (!isOwner) {
      const permission = await this.prisma.permission.findFirst({
        where: {
          userId: currentUserId,
          resourceId,
          resourceType: prismaResourceType
        }
      });

      if (!permission) {
        throw new ForbiddenException();
      }
    }

    const permissions = await this.prisma.permission.findMany({
      where: {
        resourceId,
        resourceType: prismaResourceType
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return permissions.map(p => ({
      email: p.user.email,
      role: this.mapAccessToRole(p.access)
    }));
  }
}
