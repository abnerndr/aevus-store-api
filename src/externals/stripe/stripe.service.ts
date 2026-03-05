/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';
import { CONFIG } from '../../shared/constants/env';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe | null = null;

  constructor() {
    // Não inicializar aqui para evitar erro no construtor
  }

  onModuleInit() {
    // Verificar se a chave está configurada
    if (!CONFIG.STRIPE.SECRET_KEY) {
      console.warn(
        'STRIPE_SECRET_KEY não configurada. Funcionalidades do Stripe estarão desabilitadas.',
      );
      return;
    }

    this.stripe = new Stripe(CONFIG.STRIPE.SECRET_KEY, {
      apiVersion: CONFIG.STRIPE.API_VERSION as Stripe.LatestApiVersion,
    });
  }

  getInstance(): Stripe {
    if (!this.stripe) {
      throw new Error('Stripe não está configurado. Configure STRIPE_SECRET_KEY no ambiente.');
    }
    return this.stripe;
  }

  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>,
  ): Promise<Stripe.Customer> {
    return this.getInstance().customers.create({
      email,
      name,
      metadata,
    });
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return this.getInstance().customers.retrieve(customerId) as Promise<Stripe.Customer>;
  }

  async getPrice(priceId: string): Promise<Stripe.Price> {
    return this.getInstance().prices.retrieve(priceId);
  }

  async updateCustomer(
    customerId: string,
    data: Stripe.CustomerUpdateParams,
  ): Promise<Stripe.Customer> {
    return this.getInstance().customers.update(customerId, data);
  }

  async createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams,
  ): Promise<Stripe.Checkout.Session> {
    return this.getInstance().checkout.sessions.create(params);
  }

  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.getInstance().checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });
  }

  async createSubscription(params: Stripe.SubscriptionCreateParams): Promise<Stripe.Subscription> {
    return this.getInstance().subscriptions.create(params);
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getInstance().subscriptions.retrieve(subscriptionId);
  }

  async updateSubscription(
    subscriptionId: string,
    params: Stripe.SubscriptionUpdateParams,
  ): Promise<Stripe.Subscription> {
    return this.getInstance().subscriptions.update(subscriptionId, params);
  }

  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd = false,
  ): Promise<Stripe.Subscription> {
    if (cancelAtPeriodEnd) {
      return this.getInstance().subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
    return this.getInstance().subscriptions.cancel(subscriptionId);
  }

  async createBillingPortalSession(
    customerId: string,
    returnUrl: string,
  ): Promise<Stripe.BillingPortal.Session> {
    return this.getInstance().billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }

  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    return this.getInstance().webhooks.constructEvent(
      payload,
      signature,
      CONFIG.STRIPE.WEBHOOK_SECRET,
    );
  }
}
