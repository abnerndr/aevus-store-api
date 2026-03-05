import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [FeaturesController],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
