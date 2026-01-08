import { Controller, Post, Get, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePermissionsDto } from './dto/create-permission.dto';
import { ResourceType } from '../generated/prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  createPermissions(
    @Req() req,
    @Body() dto: CreatePermissionsDto
  ) {
    return this.permissionsService.createPermissions(
      req.user.sub,
      dto
    );
  }

  @Get()
  getPermissions(
    @Req() req,
    @Query('resourceId') resourceId: string,
    @Query('resourceType') resourceType: ResourceType
  ) {
    return this.permissionsService.getPermissions(
      req.user.sub,
      resourceId,
      resourceType
    );
  }
}
