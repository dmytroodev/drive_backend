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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({
    summary: 'Upload file',
    description: 'Uploads a file to a folder or root directory',
  })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({
    name: 'folderId',
    required: false,
    description: 'Target folder ID (null for root)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        isPublic: {
          type: 'boolean',
          example: false,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
  })
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

  @ApiOperation({
    summary: 'Get files',
    description: 'Returns files in a specific folder or root directory',
  })
  @ApiQuery({
    name: 'folderId',
    required: false,
    description: 'Folder ID (null for root)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of files',
  })
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

  @ApiOperation({
    summary: 'Delete file',
    description: 'Deletes a file owned by the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'File ID',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
  })
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.filesService.remove(req.user.sub, id)
  }
}
