import {
  Controller,
  Post,
  Get,
  Delete,
  Req,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Query('folderId') folderId?: string,
    @Body('isPublic') isPublic?: string,
  ) {
    return this.filesService.create({
      file,
      userId: req.user.sub,
      folderId: folderId === 'null' ? null : folderId,
      isPublic: isPublic === 'true',
    })
  }

  @Get()
  findAll(
    @Req() req,
    @Query('folderId') folderId?: string,
  ) {
    return this.filesService.findAll(
      req.user.sub,
      folderId === 'null' ? null : folderId,
    )
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.filesService.remove(req.user.sub, id)
  }
}
