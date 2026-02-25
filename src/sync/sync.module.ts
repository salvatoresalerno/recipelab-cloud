import { Module } from '@nestjs/common'
import { SyncGateway } from './sync.gateway'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [SyncGateway],
  exports: [SyncGateway]
})
export class SyncModule {}