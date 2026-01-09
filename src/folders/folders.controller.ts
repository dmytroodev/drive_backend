import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Folders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @ApiOperation({
    summary: 'Get folders',
    description: 'Returns folders by parentId (null for root)',
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
    description: 'Parent folder ID (null for root)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of folders',
  })
  @Get()
  findAll(@Req() req, @Query('parentId') parentId?: string) {
    return this.foldersService.findAll(req.user.sub, parentId);
  }

  @ApiOperation({
    summary: 'Get folder breadcrumbs',
    description: 'Returns full folder path from root to current folder',
  })
  @ApiParam({
    name: 'folderId',
    description: 'Folder ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Folder breadcrumbs',
  })
  @Get('breadcrumbs/:folderId') 
  getBreadcrumbs(@Param('folderId') folderId: string) {
    return this.foldersService.getBreadcrumbs(folderId);
  }

  @ApiOperation({
    summary: 'Create folder',
    description: 'Creates a new folder (root or child)',
  })
  @ApiResponse({
    status: 201,
    description: 'Folder created successfully',
  })
  @Post()
  create(@Req() req, @Body() dto: CreateFolderDto) {
    return this.foldersService.create(req.user.sub, dto);
  }

  @ApiOperation({
    summary: 'Update folder',
    description: 'Rename folder or change properties',
  })
  @ApiParam({
    name: 'id',
    description: 'Folder ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Folder updated successfully',
  })
  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(req.user.sub, id, dto);
  }

  @ApiOperation({
    summary: 'Delete folder',
    description: 'Deletes a folder and all its contents (cascade)',
  })
  @ApiParam({
    name: 'id',
    description: 'Folder ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Folder deleted successfully',
  })
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.foldersService.remove(req.user.sub, id);
  }
}
