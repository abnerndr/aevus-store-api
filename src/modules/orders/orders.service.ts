import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CaptureMethod,
  DiscountType,
  OrderStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
} from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import {
  InfinitePayService,
  type InfinitePayCheckoutItem,
} from '../../externals/infinitepay/infinitepay.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CONFIG } from '../../shared/constants/env';
import {
  CheckOrderPaymentDTO,
  CreateOrderCustomerDTO,
  CreateOrderDTO,
  OrderListResponseDTO,
  OrderResponseDTO,
  QueryOrderDTO,
  UpdateOrderDTO,
} from './dto/order.dto';

const CHECKOUT_PRODUCT_INCLUDE = {
  optionalItems: true,
  promotions: {
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  },
} as const;

const ORDER_INCLUDE = {
  customer: true,
  coupon: true,
  items: {
    include: {
      optionalItems: true,
    },
  },
} as const;

type CheckoutProduct = Prisma.ProductGetPayload<{ include: typeof CHECKOUT_PRODUCT_INCLUDE }>;
type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>;
type CheckoutLine = {
  description: string;
  amountCents: number;
  kind: 'merchandise' | 'shipping';
};

type NormalizedCustomer = {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  fullAddress: string;
};

type InfinitePayWebhookPayload = {
  invoice_slug?: string;
  amount?: number;
  paid_amount?: number;
  installments?: number;
  capture_method?: 'pix' | 'credit_card';
  transaction_nsu?: string;
  order_nsu?: string;
  receipt_url?: string;
  items?: unknown[];
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly infinitePayService: InfinitePayService,
  ) {}

  async createCheckout(dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    if (!dto.items.length) {
      throw new BadRequestException('Informe ao menos um item para criar o pedido.');
    }

    const normalizedCustomer = this.normalizeCustomer(dto.customer);
    const productIds = [...new Set(dto.items.map((item) => item.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: CHECKOUT_PRODUCT_INCLUDE,
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((product) => product.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      throw new NotFoundException(`Produtos não encontrados: ${missingIds.join(', ')}`);
    }

    const unpublishedProducts = products.filter((product) => product.status !== ProductStatus.PUBLISHED);
    if (unpublishedProducts.length > 0) {
      throw new BadRequestException(
        `Os produtos ${unpublishedProducts.map((product) => product.name).join(', ')} não estão publicados.`,
      );
    }

    const handle = this.resolveHandle(products);
    const now = new Date();
    const orderId = uuidv7();
    const orderNsu = uuidv7();
    const orderNumber = this.generateOrderNumber();
    const productMap = new Map(products.map((product) => [product.id, product]));
    const checkoutLines: CheckoutLine[] = [];
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    let subtotalCents = 0;
    let promotionDiscountCents = 0;

    for (const item of dto.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Produto ${item.productId} não encontrado.`);
      }

      const optionalIds = [...new Set(item.optionalItemIds ?? [])];
      const optionalItems = optionalIds.map((optionalItemId) => {
        const optionalItem = product.optionalItems.find((entry) => entry.id === optionalItemId);
        if (!optionalItem) {
          throw new BadRequestException(
            `O item opcional ${optionalItemId} não pertence ao produto ${product.name}.`,
          );
        }

        return optionalItem;
      });

      const quantity = item.quantity;
      const unitPriceCents = this.toCents(product.price);
      const bestPromotion = this.findBestPromotion(product, now, unitPriceCents);
      const promotionDiscountPerUnit = bestPromotion
        ? this.calculateDiscount(unitPriceCents, bestPromotion.type, Number(bestPromotion.value))
        : 0;
      const discountedUnitCents = Math.max(unitPriceCents - promotionDiscountPerUnit, 0);

      const optionalSnapshots = optionalItems.map((optionalItem) => {
        const optionalUnitCents = this.toCents(optionalItem.price);
        const optionalTotalCents = optionalUnitCents * quantity;

        return {
          id: uuidv7(),
          sourceOptionalItemId: optionalItem.id,
          title: optionalItem.title,
          description: optionalItem.description ?? null,
          image: optionalItem.image ?? null,
          quantity,
          unitPrice: this.fromCents(optionalUnitCents),
          oldPrice: optionalItem.oldPrice ? Number(optionalItem.oldPrice) : null,
          total: this.fromCents(optionalTotalCents),
        };
      });

      const optionalSubtotalCents = optionalSnapshots.reduce(
        (sum, optionalItem) => sum + this.toCents(optionalItem.total),
        0,
      );
      const itemSubtotalCents = unitPriceCents * quantity + optionalSubtotalCents;
      const itemPromotionDiscountCents = promotionDiscountPerUnit * quantity;
      const itemTotalCents = discountedUnitCents * quantity + optionalSubtotalCents;

      subtotalCents += itemSubtotalCents;
      promotionDiscountCents += itemPromotionDiscountCents;

      orderItems.push({
        id: uuidv7(),
        product: { connect: { id: product.id } },
        productName: product.name,
        productModel: product.model,
        description: product.infinitePayDescription ?? product.description ?? null,
        image: product.images[0] ?? null,
        quantity,
        unitPrice: this.fromCents(unitPriceCents),
        cashPrice: product.cashPrice ? Number(product.cashPrice) : null,
        subtotal: this.fromCents(itemSubtotalCents),
        promotionDiscount: this.fromCents(itemPromotionDiscountCents),
        total: this.fromCents(itemTotalCents),
        appliedPromotionName: bestPromotion?.name ?? null,
        optionalItems: {
          create: optionalSnapshots,
        },
      });

      for (let index = 0; index < quantity; index += 1) {
        checkoutLines.push({
          description: this.buildProductCheckoutDescription(product),
          amountCents: discountedUnitCents,
          kind: 'merchandise',
        });
      }

      for (const optionalItem of optionalItems) {
        const optionalUnitCents = this.toCents(optionalItem.price);
        for (let index = 0; index < quantity; index += 1) {
          checkoutLines.push({
            description: `${product.name} - ${optionalItem.title}`,
            amountCents: optionalUnitCents,
            kind: 'merchandise',
          });
        }
      }
    }

    const afterPromotionCents = subtotalCents - promotionDiscountCents;
    const coupon = dto.couponCode
      ? await this.getValidCoupon(dto.couponCode.trim().toUpperCase(), now, afterPromotionCents)
      : null;
    const couponDiscountCents = coupon
      ? this.calculateDiscount(afterPromotionCents, coupon.type, Number(coupon.value))
      : 0;
    const shippingCents = this.toCents(dto.shippingAmount ?? 0);

    this.applyDiscountAcrossLines(checkoutLines, couponDiscountCents);

    if (shippingCents > 0) {
      checkoutLines.push({
        description: 'Frete',
        amountCents: shippingCents,
        kind: 'shipping',
      });
    }

    const totalCents = checkoutLines.reduce((sum, line) => sum + line.amountCents, 0);
    if (totalCents <= 0) {
      throw new BadRequestException('O total do pedido precisa ser maior que zero.');
    }

    const checkoutItems = checkoutLines.map<InfinitePayCheckoutItem>((line) => ({
      quantity: 1,
      price: line.amountCents,
      description: line.description,
    }));

    const checkout = await this.infinitePayService.createCheckoutLink({
      handle,
      order_nsu: orderNsu,
      items: checkoutItems,
      redirect_url: dto.redirectUrl || CONFIG.INFINITEPAY.REDIRECT_URL || undefined,
      webhook_url: CONFIG.INFINITEPAY.WEBHOOK_URL || undefined,
      customer: {
        name: normalizedCustomer.fullName,
        email: normalizedCustomer.email,
        phone_number: normalizedCustomer.phone,
      },
      address: {
        cep: normalizedCustomer.postalCode,
        street: normalizedCustomer.street,
        neighborhood: normalizedCustomer.neighborhood,
        number: normalizedCustomer.number,
        complement: normalizedCustomer.complement,
      },
    });

    const customer = await this.upsertCustomer(normalizedCustomer);

    const order = await this.prisma.order.create({
      data: {
        id: orderId,
        orderNumber,
        orderNsu,
        status: OrderStatus.REALIZADO,
        paymentStatus: PaymentStatus.PENDING,
        captureMethod: CaptureMethod.UNKNOWN,
        infinitePayHandle: handle,
        infinitePayCheckoutUrl: checkout.url,
        subtotal: this.fromCents(subtotalCents),
        promotionDiscount: this.fromCents(promotionDiscountCents),
        couponDiscount: this.fromCents(couponDiscountCents),
        shippingAmount: this.fromCents(shippingCents),
        total: this.fromCents(totalCents),
        notes: dto.notes ?? null,
        customerName: normalizedCustomer.fullName,
        customerEmail: normalizedCustomer.email,
        customerPhone: normalizedCustomer.phone,
        customerCpf: normalizedCustomer.cpf,
        postalCode: normalizedCustomer.postalCode,
        street: normalizedCustomer.street,
        neighborhood: normalizedCustomer.neighborhood,
        number: normalizedCustomer.number,
        complement: normalizedCustomer.complement ?? null,
        city: normalizedCustomer.city,
        state: normalizedCustomer.state,
        fullAddress: normalizedCustomer.fullAddress,
        customer: {
          connect: { id: customer.id },
        },
        ...(coupon
          ? {
              coupon: {
                connect: { id: coupon.id },
              },
            }
          : {}),
        items: {
          create: orderItems,
        },
      },
      include: ORDER_INCLUDE,
    });

    return this.formatOrder(order);
  }

  async findAll(query: QueryOrderDTO): Promise<OrderListResponseDTO> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where: Prisma.OrderWhereInput = {
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search, mode: 'insensitive' } },
              { orderNsu: { contains: search, mode: 'insensitive' } },
              { customerName: { contains: search, mode: 'insensitive' } },
              { customerEmail: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: ORDER_INCLUDE,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.formatOrder(order)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<OrderResponseDTO> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return this.formatOrder(order);
  }

  async update(id: string, dto: UpdateOrderDTO): Promise<OrderResponseDTO> {
    const current = await this.prisma.order.findUnique({
      where: { id },
      include: ORDER_INCLUDE,
    });

    if (!current) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    const protectedStatuses: OrderStatus[] = [
      OrderStatus.PAGO,
      OrderStatus.AGUARDANDO_ENVIO,
      OrderStatus.ENVIADO,
      OrderStatus.ENTREGUE,
    ];

    if (
      dto.status &&
      protectedStatuses.includes(dto.status) &&
      current.paymentStatus !== PaymentStatus.PAID
    ) {
      throw new BadRequestException(
        'Somente pedidos pagos podem avançar para os status de pagamento/envio.',
      );
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes || null } : {}),
      },
      include: ORDER_INCLUDE,
    });

    return this.formatOrder(updated);
  }

  async confirmPayment(dto: CheckOrderPaymentDTO): Promise<OrderResponseDTO> {
    const order = await this.prisma.order.findUnique({
      where: { orderNsu: dto.orderNsu },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    const handle = order.infinitePayHandle || CONFIG.INFINITEPAY.HANDLE;
    if (!handle) {
      throw new BadRequestException('A handle da InfinitePay não está configurada para este pedido.');
    }

    const payment = await this.infinitePayService.checkPayment({
      handle,
      order_nsu: dto.orderNsu,
      transaction_nsu: dto.transactionNsu,
      slug: dto.slug,
    });

    const updated = await this.applyPaidState(order, {
      invoiceSlug: dto.slug,
      transactionNsu: dto.transactionNsu,
      receiptUrl: dto.receiptUrl,
      captureMethod: dto.captureMethod || payment.capture_method,
      paid: payment.paid,
      amount: payment.amount,
      paidAmount: payment.paid_amount,
      installments: payment.installments,
    });

    return this.formatOrder(updated);
  }

  async handleInfinitePayWebhook(payload: InfinitePayWebhookPayload): Promise<{
    success: boolean;
    message: string | null;
  }> {
    if (!payload?.order_nsu) {
      return { success: false, message: 'order_nsu é obrigatório.' };
    }

    const order = await this.prisma.order.findUnique({
      where: { orderNsu: payload.order_nsu },
      include: ORDER_INCLUDE,
    });

    if (!order) {
      return { success: false, message: 'Pedido não encontrado.' };
    }

    await this.applyPaidState(order, {
      invoiceSlug: payload.invoice_slug,
      transactionNsu: payload.transaction_nsu,
      receiptUrl: payload.receipt_url,
      captureMethod: payload.capture_method,
      paid: true,
      amount: payload.amount,
      paidAmount: payload.paid_amount,
      installments: payload.installments,
      rawPayload: payload,
    });

    return { success: true, message: null };
  }

  private async applyPaidState(
    order: OrderWithRelations,
    payment: {
      invoiceSlug?: string;
      transactionNsu?: string;
      receiptUrl?: string;
      captureMethod?: 'pix' | 'credit_card';
      paid: boolean;
      amount?: number;
      paidAmount?: number;
      installments?: number;
      rawPayload?: unknown;
    },
  ): Promise<OrderWithRelations> {
    const nextPaymentStatus = payment.paid ? PaymentStatus.PAID : PaymentStatus.PENDING;
    const nextOrderStatus =
      payment.paid && order.status === OrderStatus.REALIZADO ? OrderStatus.PAGO : order.status;
    const shouldIncrementCouponUsage =
      payment.paid && order.paymentStatus !== PaymentStatus.PAID && order.couponId;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (shouldIncrementCouponUsage) {
        await tx.coupon.update({
          where: { id: order.couponId! },
          data: {
            usedCount: {
              increment: 1,
            },
          },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: nextPaymentStatus,
          status: nextOrderStatus,
          captureMethod: this.mapCaptureMethod(payment.captureMethod),
          ...(order.infinitePayHandle
            ? {}
            : { infinitePayHandle: order.infinitePayHandle || CONFIG.INFINITEPAY.HANDLE || null }),
          ...(payment.invoiceSlug !== undefined
            ? { infinitePayInvoiceSlug: payment.invoiceSlug || null }
            : {}),
          ...(payment.transactionNsu !== undefined
            ? { infinitePayTransactionNsu: payment.transactionNsu || null }
            : {}),
          ...(payment.receiptUrl !== undefined
            ? { infinitePayReceiptUrl: payment.receiptUrl || null }
            : {}),
          ...(payment.paidAmount !== undefined
            ? { paidAmount: this.fromCents(Math.round(payment.paidAmount)) }
            : {}),
          ...(payment.installments !== undefined ? { installments: payment.installments } : {}),
          ...(payment.rawPayload !== undefined ? { lastWebhookPayload: payment.rawPayload as Prisma.JsonObject } : {}),
          ...(payment.paid ? { paidAt: new Date() } : {}),
        },
        include: ORDER_INCLUDE,
      });
    });

    return updated;
  }

  private async getValidCoupon(code: string, now: Date, baseAmountCents: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado.');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Este cupom está inativo.');
    }

    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException('Este cupom ainda não está vigente.');
    }

    if (coupon.endsAt && coupon.endsAt < now) {
      throw new BadRequestException('Este cupom expirou.');
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Este cupom atingiu o limite de uso.');
    }

    if (
      coupon.minimumOrderAmount !== null &&
      baseAmountCents < this.toCents(coupon.minimumOrderAmount)
    ) {
      throw new BadRequestException('O pedido não atingiu o valor mínimo para este cupom.');
    }

    return coupon;
  }

  private findBestPromotion(product: CheckoutProduct, now: Date, unitPriceCents: number) {
    const activePromotions = product.promotions.filter((promotion) => {
      if (!promotion.isActive) return false;
      if (promotion.startsAt && promotion.startsAt > now) return false;
      if (promotion.endsAt && promotion.endsAt < now) return false;

      return promotion.products.length === 0 || promotion.products.some((item) => item.id === product.id);
    });

    let bestPromotion: CheckoutProduct['promotions'][number] | null = null;
    let bestDiscount = 0;

    for (const promotion of activePromotions) {
      const discount = this.calculateDiscount(unitPriceCents, promotion.type, Number(promotion.value));
      if (discount > bestDiscount) {
        bestDiscount = discount;
        bestPromotion = promotion;
      }
    }

    return bestPromotion;
  }

  private calculateDiscount(amountCents: number, type: DiscountType, value: number): number {
    if (amountCents <= 0 || value <= 0) return 0;

    if (type === DiscountType.PERCENTAGE) {
      return Math.min(amountCents, Math.round((amountCents * value) / 100));
    }

    return Math.min(amountCents, Math.round(value * 100));
  }

  private applyDiscountAcrossLines(lines: CheckoutLine[], discountCents: number): void {
    if (discountCents <= 0) return;

    const eligibleLines = lines.filter((line) => line.kind === 'merchandise' && line.amountCents > 0);
    if (eligibleLines.length === 0) return;

    const totalEligible = eligibleLines.reduce((sum, line) => sum + line.amountCents, 0);
    const discounts = eligibleLines.map(() => 0);
    let applied = 0;

    eligibleLines.forEach((line, index) => {
      if (index === eligibleLines.length - 1) return;
      const proportional = Math.min(
        line.amountCents,
        Math.floor((discountCents * line.amountCents) / totalEligible),
      );
      discounts[index] = proportional;
      applied += proportional;
    });

    let remaining = Math.min(discountCents, totalEligible) - applied;
    if (remaining > 0) {
      const sortedIndexes = eligibleLines
        .map((line, index) => ({ index, remainingCapacity: line.amountCents - discounts[index] }))
        .sort((left, right) => right.remainingCapacity - left.remainingCapacity)
        .map((entry) => entry.index);

      while (remaining > 0) {
        let progressed = false;
        for (const index of sortedIndexes) {
          if (remaining === 0) break;
          if (eligibleLines[index].amountCents - discounts[index] <= 0) continue;
          discounts[index] += 1;
          remaining -= 1;
          progressed = true;
        }

        if (!progressed) break;
      }
    }

    eligibleLines.forEach((line, index) => {
      line.amountCents -= discounts[index];
    });
  }

  private resolveHandle(products: CheckoutProduct[]): string {
    const handles = [...new Set(products.map((product) => product.infinitePayHandle).filter(Boolean))];

    if (handles.length > 1) {
      throw new BadRequestException(
        'Os produtos selecionados possuem handles da InfinitePay diferentes e não podem ser comprados juntos.',
      );
    }

    return handles[0] || CONFIG.INFINITEPAY.HANDLE || this.ensureConfiguredHandle();
  }

  private ensureConfiguredHandle(): never {
    throw new BadRequestException(
      'Nenhuma handle da InfinitePay foi configurada no produto nem no ambiente.',
    );
  }

  private async upsertCustomer(customer: NormalizedCustomer) {
    const existing = await this.prisma.customer.findFirst({
      where: {
        OR: [{ email: customer.email }, { cpf: customer.cpf }],
      },
    });

    if (existing) {
      return this.prisma.customer.update({
        where: { id: existing.id },
        data: {
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          cpf: customer.cpf,
          postalCode: customer.postalCode,
          street: customer.street,
          neighborhood: customer.neighborhood,
          number: customer.number,
          complement: customer.complement ?? null,
          city: customer.city,
          state: customer.state,
          fullAddress: customer.fullAddress,
        },
      });
    }

    return this.prisma.customer.create({
      data: {
        id: uuidv7(),
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        cpf: customer.cpf,
        postalCode: customer.postalCode,
        street: customer.street,
        neighborhood: customer.neighborhood,
        number: customer.number,
        complement: customer.complement ?? null,
        city: customer.city,
        state: customer.state,
        fullAddress: customer.fullAddress,
      },
    });
  }

  private normalizeCustomer(customer: CreateOrderCustomerDTO): NormalizedCustomer {
    const postalCode = customer.postalCode.replace(/\D/g, '');
    const cpf = customer.cpf.replace(/\D/g, '');
    const digits = customer.phone.replace(/\D/g, '');
    const phone = digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
    const state = customer.state.trim().toUpperCase();
    const fullAddress =
      customer.fullAddress?.trim() ||
      [
        `${customer.street}, ${customer.number}`,
        customer.complement || null,
        customer.neighborhood,
        `${customer.city} - ${state}`,
        `CEP ${postalCode}`,
      ]
        .filter(Boolean)
        .join(', ');

    return {
      fullName: customer.fullName.trim(),
      email: customer.email.trim().toLowerCase(),
      phone,
      cpf,
      postalCode,
      street: customer.street.trim(),
      neighborhood: customer.neighborhood.trim(),
      number: customer.number.trim(),
      complement: customer.complement?.trim() || undefined,
      city: customer.city.trim(),
      state,
      fullAddress,
    };
  }

  private buildProductCheckoutDescription(product: CheckoutProduct): string {
    const prefix = product.infinitePayId ? `${product.infinitePayId} - ` : '';
    return `${prefix}${product.infinitePayDescription || product.name}`;
  }

  private mapCaptureMethod(method?: 'pix' | 'credit_card'): CaptureMethod {
    if (method === 'pix') return CaptureMethod.PIX;
    if (method === 'credit_card') return CaptureMethod.CREDIT_CARD;
    return CaptureMethod.UNKNOWN;
  }

  private toCents(value: number | Prisma.Decimal): number {
    return Math.round(Number(value) * 100);
  }

  private fromCents(value: number): number {
    return value / 100;
  }

  private generateOrderNumber(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const suffix = uuidv7().slice(-6).toUpperCase();
    return `AVS-${date}-${suffix}`;
  }

  private formatOrder(order: OrderWithRelations): OrderResponseDTO {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      orderNsu: order.orderNsu,
      status: order.status,
      paymentStatus: order.paymentStatus,
      captureMethod: order.captureMethod,
      infinitePayHandle: order.infinitePayHandle ?? undefined,
      infinitePayInvoiceSlug: order.infinitePayInvoiceSlug ?? undefined,
      infinitePayTransactionNsu: order.infinitePayTransactionNsu ?? undefined,
      infinitePayCheckoutUrl: order.infinitePayCheckoutUrl ?? undefined,
      infinitePayReceiptUrl: order.infinitePayReceiptUrl ?? undefined,
      subtotal: Number(order.subtotal),
      promotionDiscount: Number(order.promotionDiscount),
      couponDiscount: Number(order.couponDiscount),
      shippingAmount: Number(order.shippingAmount),
      total: Number(order.total),
      paidAmount: order.paidAmount ? Number(order.paidAmount) : undefined,
      installments: order.installments ?? undefined,
      notes: order.notes ?? undefined,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      customerCpf: order.customerCpf,
      postalCode: order.postalCode,
      street: order.street,
      neighborhood: order.neighborhood,
      number: order.number,
      complement: order.complement ?? undefined,
      city: order.city,
      state: order.state,
      fullAddress: order.fullAddress,
      customer: {
        id: order.customer.id,
        fullName: order.customer.fullName,
        email: order.customer.email,
        phone: order.customer.phone,
        cpf: order.customer.cpf,
        fullAddress: order.customer.fullAddress,
      },
      coupon: order.coupon
        ? {
            id: order.coupon.id,
            code: order.coupon.code,
            type: order.coupon.type,
            value: Number(order.coupon.value),
          }
        : undefined,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId ?? undefined,
        productName: item.productName,
        productModel: item.productModel ?? undefined,
        description: item.description ?? undefined,
        image: item.image ?? undefined,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        cashPrice: item.cashPrice ? Number(item.cashPrice) : undefined,
        subtotal: Number(item.subtotal),
        promotionDiscount: Number(item.promotionDiscount),
        total: Number(item.total),
        appliedPromotionName: item.appliedPromotionName ?? undefined,
        optionalItems: item.optionalItems.map((optionalItem) => ({
          id: optionalItem.id,
          sourceOptionalItemId: optionalItem.sourceOptionalItemId ?? undefined,
          title: optionalItem.title,
          description: optionalItem.description ?? undefined,
          image: optionalItem.image ?? undefined,
          quantity: optionalItem.quantity,
          unitPrice: Number(optionalItem.unitPrice),
          oldPrice: optionalItem.oldPrice ? Number(optionalItem.oldPrice) : undefined,
          total: Number(optionalItem.total),
        })),
      })),
      paidAt: order.paidAt ?? undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
