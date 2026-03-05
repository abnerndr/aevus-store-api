import { Module } from '@nestjs/common';
import { CloudflareModule } from 'src/externals/cloudflare/cloudflare.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [CloudflareModule, AuthModule, UsersModule],
  controllers: [UploadsController],
})
export class UploadsModule {}
