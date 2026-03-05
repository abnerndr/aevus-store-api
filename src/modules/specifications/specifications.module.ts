import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
