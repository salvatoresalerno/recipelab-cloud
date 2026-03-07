import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SyncGateway } from './sync/sync.gateway';
import { SyncModule } from './sync/sync.module';
import { TestModule } from './test/test.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AreaModule } from './area/area.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),    
    PrismaModule,
    AuthModule,
    SyncModule,
    TestModule,
    CategoriaModule,
    AreaModule,
    MediaModule
  ],
  controllers: [AppController],
  providers: [AppService, SyncGateway],
})
export class AppModule {}
