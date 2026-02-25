import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SyncGateway } from './sync/sync.gateway';
import { SyncModule } from './sync/sync.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),    
    PrismaModule,
    AuthModule,
    SyncModule,
    TestModule
  ],
  controllers: [AppController],
  providers: [AppService, SyncGateway],
})
export class AppModule {}
