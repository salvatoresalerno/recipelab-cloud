import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Get
} from '@nestjs/common'

import { TestService } from './test.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentLoggedUser } from 'src/auth/decorators/currentLoggedUser.decorators'
import type { CurrentUser } from 'src/common/types/commonTypes'

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
    async create(@CurrentLoggedUser() user: CurrentUser, @Body() body: { title: string }) {
         

        return this.testService.create(user.id, body.title)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@CurrentLoggedUser() user: CurrentUser, @Param('id') id: string, @Body() body: { title: string }) {
         

        return this.testService.update(user.id, id, body.title)
    }
}