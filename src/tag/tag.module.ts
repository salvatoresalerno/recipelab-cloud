import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { SyncModule } from 'src/sync/sync.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [SyncModule],
  controllers: [TagController],
  providers: [TagService, PrismaService],
})
export class TagModule {}
