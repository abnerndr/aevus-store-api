import { Module } from '@nestjs/common';
import { InfinitePayService } from './infinitepay.service';

@Module({
  providers: [InfinitePayService],
  exports: [InfinitePayService],
})
export class InfinitePayModule {}
