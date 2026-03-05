import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FactoriesController } from './factories.controller';
import { FactoriesService } from './factories.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [FactoriesController],
  providers: [FactoriesService],
  exports: [FactoriesService],
})
export class FactoriesModule {}
