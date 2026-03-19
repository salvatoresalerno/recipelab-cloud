import { Body, Controller, Delete, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators';
import type { CurrentUser } from 'src/common/types/commonTypes';
import { CreateTagDto } from './dto/create-tag.dto';
import { CustomException } from 'src/common/custom-exception/CustomException';
import { CustomUUIDPipe } from 'src/common/custom-validator/CustomUUIDPipe';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}


  @Post()
  async create(
    @CurrentLoggedUser() user: CurrentUser, 
    @Body() body: CreateTagDto,
    @Headers('x-device-id') deviceId: string,
  ) {

    if (!deviceId) {
      throw new CustomException('Missing deviceId')
    }

    return await this.tagService.create(user.userId, deviceId, body);
  }



  @Patch(':id')
  async update(
    @CurrentLoggedUser() user: CurrentUser,
    @Param('id', CustomUUIDPipe) id: string, 
    @Body() body: UpdateTagDto,
    @Headers('x-device-id') deviceId: string,
  ) {

    if (!deviceId) {
      throw new CustomException('Missing deviceId')
    }
    
    
    
    return await this.tagService.update(id, user.userId, deviceId, body);

  }


  @Delete(':id')
  async remove(
    @Param('id', CustomUUIDPipe) id: string,
    @CurrentLoggedUser() user: CurrentUser,
    @Headers('x-device-id') deviceId: string,
  ) {

    return this.tagService.remove(id, user.userId, deviceId);
    
  }
}
