
import { CategoriaService } from './categoria.service';
import { Body, Headers, Controller, Post, UseGuards, UploadedFile, UseInterceptors, HttpStatus, Patch, Param, Delete } from '@nestjs/common';
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomException } from 'src/common/custom-exception/CustomException';
import type { CurrentUser } from 'src/common/types/commonTypes'
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/multer.config';
import { CustomUUIDPipe } from 'src/common/custom-validator/CustomUUIDPipe';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { join } from 'path';

const categorieImageUpload = createMulterConfig('./uploads/categorie', 10);

@Controller('categoria')
@UseGuards(JwtAuthGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}




  
  @Post()
  @UseInterceptors(FileInterceptor('image', categorieImageUpload))
  async create(
    @CurrentLoggedUser() user: CurrentUser, 
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateCategorieDto,
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

    return await this.categoriaService.create(user.userId, deviceId, body);
  }



  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', categorieImageUpload))
  async update(
    @CurrentLoggedUser() user: CurrentUser,
    @UploadedFile() image: Express.Multer.File, 
    @Param('id', CustomUUIDPipe) id: string, 
    @Body() body: UpdateCategorieDto,
    @Headers('x-device-id') deviceId: string,
  ) {

    if (!deviceId) {
      throw new CustomException('Missing deviceId')
    }
    
    //body.image = image ? image.filename : undefined;
    body.image = image ? join(user.userId.toString(), image.filename) : undefined;
    
    return await this.categoriaService.update(id, user.userId, deviceId, body);

  }


  @Delete(':id')
  async remove(
    @Param('id', CustomUUIDPipe) id: string,
    @CurrentLoggedUser() user: CurrentUser,
    @Headers('x-device-id') deviceId: string,
  ) {

    return this.categoriaService.remove(id, user.userId, deviceId);
    
  }





}
