import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { CONFIG } from '../../shared/constants/env';

export interface InfinitePayCheckoutItem {
  quantity: number;
  price: number;
  description: string;
}

export interface InfinitePayCheckoutCustomer {
  name: string;
  email: string;
  phone_number: string;
}

export interface InfinitePayCheckoutAddress {
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement?: string;
}

export interface CreateInfinitePayCheckoutPayload {
  handle: string;
  order_nsu: string;
  items: InfinitePayCheckoutItem[];
  redirect_url?: string;
  webhook_url?: string;
  customer?: InfinitePayCheckoutCustomer;
  address?: InfinitePayCheckoutAddress;
}

export interface InfinitePayPaymentCheckPayload {
  handle: string;
  order_nsu: string;
  transaction_nsu: string;
  slug: string;
}

export interface InfinitePayPaymentCheckResponse {
  success: boolean;
  paid: boolean;
  amount: number;
  paid_amount: number;
  installments: number;
  capture_method: 'pix' | 'credit_card';
}

@Injectable()
export class InfinitePayService {
  private readonly logger = new Logger(InfinitePayService.name);
  private readonly apiUrl = CONFIG.INFINITEPAY.API_URL.replace(/\/$/, '');

  async createCheckoutLink(payload: CreateInfinitePayCheckoutPayload): Promise<{ url: string }> {
    const data = await this.request<{ url?: string }>('/invoices/public/checkout/links', payload);

    if (!data?.url) {
      throw new BadGatewayException('InfinitePay não retornou a URL do checkout.');
    }

    return { url: data.url };
  }

  async checkPayment(
    payload: InfinitePayPaymentCheckPayload,
  ): Promise<InfinitePayPaymentCheckResponse> {
    const data = await this.request<InfinitePayPaymentCheckResponse>(
      '/invoices/public/checkout/payment_check',
      payload,
    );

    if (typeof data?.paid !== 'boolean') {
      throw new BadGatewayException('InfinitePay retornou uma resposta inválida ao consultar o pagamento.');
    }

    return data;
  }

  private async request<T>(path: string, body: unknown): Promise<T> {
    const url = `${this.apiUrl}${path}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();
      const parsed = text ? (JSON.parse(text) as T | { message?: string }) : ({} as T);

      if (!response.ok) {
        const message =
          (parsed as { message?: string })?.message ||
          `InfinitePay respondeu com status ${response.status}.`;
        throw new BadGatewayException(message);
      }

      return parsed as T;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      this.logger.error(
        `Erro ao comunicar com a InfinitePay: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new BadGatewayException('Não foi possível comunicar com a InfinitePay.');
    }
  }
}
