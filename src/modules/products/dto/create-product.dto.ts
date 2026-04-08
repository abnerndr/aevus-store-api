import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Movement, ProductStatus, UseCase, WatchType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';

export class CreateProductOptionalItemDTO {
  @ApiProperty({ example: 'Caixa Premium' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 49.9 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 69.9 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  oldPrice?: number;

  @ApiPropertyOptional({ example: 'https://cdn.site.com/item-opcional.jpg' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateProductInstallmentOptionDTO {
  @ApiPropertyOptional({ example: '3x sem juros' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  installments: number;

  @ApiProperty({ example: 133.3 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  installmentAmount: number;

  @ApiProperty({ example: 399.9 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  feePercentage?: number;
}

export class CreateProductReviewDTO {
  @ApiProperty({ example: 'João' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  authorName: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Excelente acabamento' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Produto muito bem construído e com ótimo custo-benefício.' })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateProductDTO {
  @ApiProperty({ description: 'Watch commercial name', example: 'Submariner Date' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Watch model reference', example: '116610LN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model: string;

  @ApiPropertyOptional({ description: 'Detailed description', example: 'Black dial, ceramic bezel' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Publication status', enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus = ProductStatus.DRAFT;

  @ApiProperty({ description: 'Price in BRL', example: 350.00 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Cash / one-time payment price in BRL', example: 329.9 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cashPrice?: number;

  @ApiProperty({ description: 'Stock quantity', example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ description: 'Product image URLs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[] = [];

  @ApiPropertyOptional({ description: 'Search tags', type: [String], example: ['dive', 'luxury'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];

  // ─── Watch specs ──────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Watch quality grade', enum: WatchType, example: WatchType.SUPER_CLONE })
  @IsEnum(WatchType)
  watchType: WatchType;

  @ApiProperty({ description: 'Case material', example: '316L Stainless Steel' })
  @IsString()
  @IsNotEmpty()
  caseMaterial: string;

  @ApiProperty({ description: 'Case diameter (e.g. 40mm)', example: '40mm' })
  @IsString()
  @IsNotEmpty()
  caseDiameter: string;

  @ApiProperty({ description: 'Crystal / glass material', example: 'Sapphire' })
  @IsString()
  @IsNotEmpty()
  crystalMaterial: string;

  @ApiProperty({ description: 'Strap / bracelet material', example: 'Oyster Bracelet Steel' })
  @IsString()
  @IsNotEmpty()
  strapMaterial: string;

  @ApiProperty({ description: 'Movement type', enum: Movement, example: Movement.MIYOTA })
  @IsEnum(Movement)
  movement: Movement;

  @ApiProperty({ description: 'Intended use case', enum: UseCase, example: UseCase.CASUAL })
  @IsEnum(UseCase)
  useCase: UseCase;

  // ─── Highlights ───────────────────────────────────────────────────────────

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isNew?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isBestSeller?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isTopRated?: boolean = false;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isDiscounted?: boolean = false;

  @ApiPropertyOptional({ description: 'Discount percentage (0–100)', example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Purchase note shown in the order summary' })
  @IsOptional()
  @IsString()
  purchaseNotes?: string;

  @ApiPropertyOptional({ description: 'InfinitePay custom product identifier' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  infinitePayId?: string;

  @ApiPropertyOptional({ description: 'InfinitePay handle override for this product' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  infinitePayHandle?: string;

  @ApiPropertyOptional({ description: 'InfinitePay checkout description for the item' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  infinitePayDescription?: string;

  @ApiPropertyOptional({ description: 'Optional upsell items', type: [CreateProductOptionalItemDTO] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionalItemDTO)
  optionalItems?: CreateProductOptionalItemDTO[] = [];

  @ApiPropertyOptional({
    description: 'Installment configurations',
    type: [CreateProductInstallmentOptionDTO],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductInstallmentOptionDTO)
  installmentOptions?: CreateProductInstallmentOptionDTO[] = [];

  @ApiPropertyOptional({ description: 'Product reviews', type: [CreateProductReviewDTO] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductReviewDTO)
  reviews?: CreateProductReviewDTO[] = [];

  // ─── Relations ────────────────────────────────────────────────────────────

  @ApiProperty({ description: 'Brand UUID', example: '018e...' })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiPropertyOptional({ description: 'Category UUIDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[] = [];

  @ApiPropertyOptional({ description: 'Feature UUIDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featureIds?: string[] = [];

  @ApiPropertyOptional({ description: 'Specification UUIDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specificationIds?: string[] = [];

  @ApiPropertyOptional({ description: 'Factory UUIDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  factoryIds?: string[] = [];

  @ApiPropertyOptional({ description: 'Supplier UUIDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supplierIds?: string[] = [];
}
