import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { SyncModule } from 'src/sync/sync.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [SyncModule],
  providers: [TestService, PrismaService],
  controllers: [TestController]
})
export class TestModule {}
