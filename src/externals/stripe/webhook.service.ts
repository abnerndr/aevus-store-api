import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { CONFIG } from '../../shared/constants/env';
import { StripeService } from './stripe.service';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  async handleWebhook(req: { rawBody?: unknown; body?: unknown }, signature: string) {
    const bodyPayload = this.validateBody(req);
    const event = this.constructEvent(bodyPayload, signature);
    this.logger.log(`Stripe event received: ${event.type} (id: ${event.id})`);
    await this.selectEvent(event);
    return { received: true };
  }

  private constructEvent(bodyPayload: Buffer | string, signature: string): Stripe.Event {
    try {
      return this.stripeService.constructWebhookEvent(bodyPayload, signature);
    } catch (err) {
      const isDev = CONFIG.NODE_ENV === 'development' || CONFIG.NODE_ENV === 'develop';
      if (isDev) {
        this.logger.warn(
          `Webhook: signature check failed in development — parsing without validation. Error: ${(err as Error).message}`,
        );
        const bodyStr = Buffer.isBuffer(bodyPayload) ? bodyPayload.toString('utf-8') : bodyPayload;
        return JSON.parse(bodyStr) as Stripe.Event;
      }
      throw err;
    }
  }

  private validateBody(req: { rawBody?: unknown; body?: unknown }): Buffer | string {
    const raw = req.rawBody;
    if (Buffer.isBuffer(raw)) return raw;
    if (typeof raw === 'string') return raw;

    const body = req.body;
    if (typeof body === 'string') return body;
    if (body && typeof body === 'object') return JSON.stringify(body);

    throw new Error('Invalid request body format');
  }

  private async selectEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event);
          return;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event);
          return;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event);
          return;
        default:
          this.logger.debug(`Unhandled Stripe event: ${event.type}`);
          return;
      }
    } catch (err) {
      this.logger.error(
        `Error processing webhook ${event.type} (${event.id}): ${(err as Error).message}`,
        (err as Error).stack,
      );
      throw err;
    }
  }

  private async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    this.logger.log(
      `checkout.session.completed — session id: ${session.id}, amount: ${session.amount_total}`,
    );
    // TODO: create order record and update stock
  }

  private async handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.log(`payment_intent.succeeded — id: ${paymentIntent.id}`);
    // TODO: confirm order payment
  }

  private async handlePaymentIntentFailed(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    this.logger.warn(`payment_intent.payment_failed — id: ${paymentIntent.id}`);
    // TODO: handle failed payment
  }
}
