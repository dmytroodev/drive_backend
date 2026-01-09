import { Controller, Post, Get, Query, Body, UseGuards, Req } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePermissionsDto } from './dto/create-permission.dto';
import { ResourceType } from '../generated/prisma/client';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({
    summary: 'Grant access',
    description: 'Grants access to a file or folder for another user',
  })
  @ApiResponse({
    status: 201,
    description: 'Permission granted successfully',
  })
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

  @ApiOperation({
    summary: 'Get permissions',
    description: 'Returns permissions for a specific resource',
  })
  @ApiQuery({
    name: 'resourceId',
    description: 'ID of the resource (file or folder)',
  })
  @ApiQuery({
    name: 'resourceType',
    enum: ResourceType,
    description: 'Type of the resource',
  })
  @ApiResponse({
    status: 200,
    description: 'List of permissions',
  })
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
