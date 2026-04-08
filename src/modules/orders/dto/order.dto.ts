import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CaptureMethod,
  DiscountType,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderCustomerDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ example: '01234567' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiPropertyOptional({ example: 'Apto 45' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullAddress?: string;
}

export class CreateOrderItemDTO {
  @ApiProperty({ example: '018f0a63-0f42-7a31-b5f0-1e904c0fa111' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number = 1;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionalItemIds?: string[] = [];
}

export class CreateOrderDTO {
  @ApiProperty({ type: CreateOrderCustomerDTO })
  @ValidateNested()
  @Type(() => CreateOrderCustomerDTO)
  customer: CreateOrderCustomerDTO;

  @ApiProperty({ type: [CreateOrderItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://site.com/pedido/concluido' })
  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @ApiPropertyOptional({ example: 39.9, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shippingAmount?: number = 0;
}

export class CheckOrderPaymentDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  orderNsu: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionNsu: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional({ enum: ['pix', 'credit_card'] })
  @IsOptional()
  @IsString()
  captureMethod?: 'pix' | 'credit_card';
}

export class UpdateOrderDTO {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryOrderDTO {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ default: 'createdAt', enum: ['createdAt', 'orderNumber', 'total'] })
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'orderNumber' | 'total' = 'createdAt';

  @ApiPropertyOptional({ default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

class OrderCustomerResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() fullName: string;
  @ApiProperty() email: string;
  @ApiProperty() phone: string;
  @ApiProperty() cpf: string;
  @ApiProperty() fullAddress: string;
}

class OrderCouponResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiProperty({ enum: DiscountType }) type: DiscountType;
  @ApiProperty() value: number;
}

class OrderOptionalItemResponseDTO {
  @ApiProperty() id: string;
  @ApiPropertyOptional() sourceOptionalItemId?: string;
  @ApiProperty() title: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() image?: string;
  @ApiProperty() quantity: number;
  @ApiProperty() unitPrice: number;
  @ApiPropertyOptional() oldPrice?: number;
  @ApiProperty() total: number;
}

class OrderItemResponseDTO {
  @ApiProperty() id: string;
  @ApiPropertyOptional() productId?: string;
  @ApiProperty() productName: string;
  @ApiPropertyOptional() productModel?: string;
  @ApiPropertyOptional() description?: string;
  @ApiPropertyOptional() image?: string;
  @ApiProperty() quantity: number;
  @ApiProperty() unitPrice: number;
  @ApiPropertyOptional() cashPrice?: number;
  @ApiProperty() subtotal: number;
  @ApiProperty() promotionDiscount: number;
  @ApiProperty() total: number;
  @ApiPropertyOptional() appliedPromotionName?: string;
  @ApiProperty({ type: [OrderOptionalItemResponseDTO] }) optionalItems: OrderOptionalItemResponseDTO[];
}

export class OrderResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() orderNumber: string;
  @ApiProperty() orderNsu: string;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty({ enum: PaymentStatus }) paymentStatus: PaymentStatus;
  @ApiProperty({ enum: CaptureMethod }) captureMethod: CaptureMethod;
  @ApiPropertyOptional() infinitePayHandle?: string;
  @ApiPropertyOptional() infinitePayInvoiceSlug?: string;
  @ApiPropertyOptional() infinitePayTransactionNsu?: string;
  @ApiPropertyOptional() infinitePayCheckoutUrl?: string;
  @ApiPropertyOptional() infinitePayReceiptUrl?: string;
  @ApiProperty() subtotal: number;
  @ApiProperty() promotionDiscount: number;
  @ApiProperty() couponDiscount: number;
  @ApiProperty() shippingAmount: number;
  @ApiProperty() total: number;
  @ApiPropertyOptional() paidAmount?: number;
  @ApiPropertyOptional() installments?: number;
  @ApiPropertyOptional() notes?: string;
  @ApiProperty() customerName: string;
  @ApiProperty() customerEmail: string;
  @ApiProperty() customerPhone: string;
  @ApiProperty() customerCpf: string;
  @ApiProperty() postalCode: string;
  @ApiProperty() street: string;
  @ApiProperty() neighborhood: string;
  @ApiProperty() number: string;
  @ApiPropertyOptional() complement?: string;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty() fullAddress: string;
  @ApiProperty({ type: OrderCustomerResponseDTO }) customer: OrderCustomerResponseDTO;
  @ApiPropertyOptional({ type: OrderCouponResponseDTO }) coupon?: OrderCouponResponseDTO;
  @ApiProperty({ type: [OrderItemResponseDTO] }) items: OrderItemResponseDTO[];
  @ApiPropertyOptional() paidAt?: Date;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class OrderListResponseDTO {
  @ApiProperty({ type: [OrderResponseDTO] }) data: OrderResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}

export class InfinitePayWebhookResponseDTO {
  @ApiProperty() success: boolean;
  @ApiProperty({ nullable: true }) message: string | null;
}
