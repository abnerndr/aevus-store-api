import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
