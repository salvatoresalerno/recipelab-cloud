import { Body, Controller, Delete, Headers, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AreaService } from './area.service';
import { createMulterConfig } from 'src/multer.config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators';
import { CustomException } from 'src/common/custom-exception/CustomException';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import type { CurrentUser } from 'src/common/types/commonTypes';
import { CustomUUIDPipe } from 'src/common/custom-validator/CustomUUIDPipe';
import { UpdateAreaDto } from './dto/update-area.dto';
import { CreateAreaDto } from './dto/create-area.dto';


const areaImageUpload = createMulterConfig('./uploads/bandiere', 10);

@Controller('area')
@UseGuards(JwtAuthGuard)
export class AreaController {
  constructor(private readonly areaService: AreaService) {}


  @Post()
  @UseInterceptors(FileInterceptor('image', areaImageUpload))
  async create(
    @CurrentLoggedUser() user: CurrentUser, 
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateAreaDto,
    @Headers('x-device-id') deviceId: string,
  ) {

    if (!deviceId) {
      throw new CustomException('Missing deviceId')
    }

    if (!image) {
      throw new CustomException('File non presente - Immagine obbligatoria per la creazione', HttpStatus.NOT_FOUND, 'BadRequest');
    }

    //body.image = image.filename;  
    body.image = join(user.userId.toString(), image.filename); 

    return await this.areaService.create(user.userId, deviceId, body);
  }



  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', areaImageUpload))
  async update(
    @CurrentLoggedUser() user: CurrentUser,
    @UploadedFile() image: Express.Multer.File, 
    @Param('id', CustomUUIDPipe) id: string, 
    @Body() body: UpdateAreaDto,
    @Headers('x-device-id') deviceId: string,
  ) {

    if (!deviceId) {
      throw new CustomException('Missing deviceId')
    }
    
    //body.image = image ? image.filename : undefined;
    body.image = image ? join(user.userId.toString(), image.filename) : undefined;
    
    return await this.areaService.update(id, user.userId, deviceId, body);

  }


  @Delete(':id')
  async remove(
    @Param('id', CustomUUIDPipe) id: string,
    @CurrentLoggedUser() user: CurrentUser,
    @Headers('x-device-id') deviceId: string,
  ) {

    return this.areaService.remove(id, user.userId, deviceId);
    
  }
  
}
