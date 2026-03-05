import { Module } from '@nestjs/common';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeService } from './stripe.service';
import { WebhookService } from './webhook.service';

@Module({
  providers: [StripeService, WebhookService],
  controllers: [StripeWebhookController],
  exports: [StripeService, WebhookService],
})
export class StripeModule {}
