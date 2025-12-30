import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Get()
  findAll(@Req() req, @Query('parentId') parentId?: string) {
    return this.foldersService.findAll(req.user.sub, parentId);
  }

  @Get('breadcrumbs/:folderId') 
  getBreadcrumbs(@Param('folderId') folderId: string) {
    return this.foldersService.getBreadcrumbs(folderId);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateFolderDto) {
    return this.foldersService.create(req.user.sub, dto);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.foldersService.remove(req.user.sub, id);
  }
}
