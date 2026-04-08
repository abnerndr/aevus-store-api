import { Module, forwardRef } from '@nestjs/common';
import { InfinitePayModule } from '../../externals/infinitepay/infinitepay.module';
import { AuthModule } from '../auth/auth.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersWebhookController } from './orders-webhook.controller';

@Module({
  imports: [forwardRef(() => AuthModule), InfinitePayModule],
  controllers: [OrdersController, OrdersWebhookController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
