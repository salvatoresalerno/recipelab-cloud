import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Get,
  Headers,
  Query
} from '@nestjs/common'

import { TestService } from './test.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators'
import type { CurrentUser } from 'src/common/types/commonTypes'
import { CustomException } from 'src/common/custom-exception/CustomException'
import { SyncChangesDto } from './dto/sync-changes.dto'

@Controller('test')
export class TestController {
    constructor(private testService: TestService) {}

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async findOne(@CurrentLoggedUser() user: CurrentUser, @Param('id') id: string) {
         

        return this.testService.findOne(user.id, id)
    }
    
    
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @CurrentLoggedUser() user: CurrentUser, 
        @Body() body: { title: string },
        @Headers('x-device-id') deviceId: string,
    ) {

        if (!deviceId) {
            throw new CustomException('Missing deviceId')
        }
         

        return this.testService.create(user.id, body.title, deviceId)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @CurrentLoggedUser() user: CurrentUser, 
        @Param('id') id: string,
        @Body() body: { title: string },
        @Headers('x-device-id') deviceId: string,
    ) {
         

        return this.testService.update(user.id, id, body.title, deviceId)
    }




    @Get('recovery/:lastChangeId')
    @UseGuards(JwtAuthGuard)
    async getRecoveryData(@CurrentLoggedUser() user: CurrentUser, @Param('lastChangeId') lastChangeId: string,) {  // Arriva come stringa dalla URL
    
        return await this.testService.getChangesSince(user.id, lastChangeId);
    }













    /* @Get('changes')
    async getChanges(
        @Query('sinceId') sinceId: string,
        @CurrentLoggedUser() user: CurrentUser, 
    ) {
         

        return this.testService.getChangesSince(sinceId, user.id)
    } */


    @Post('changes')
    @UseGuards(JwtAuthGuard)
    async changes(@CurrentLoggedUser() user: CurrentUser, @Body() dto: SyncChangesDto) {

        console.log('user: ', user)
        console.log('dto: ', dto)
        
         

        return this.testService.getChanges(
            user.id,
            dto.lastChangeId,
            dto.tables ?? []
        );
    }

     













}