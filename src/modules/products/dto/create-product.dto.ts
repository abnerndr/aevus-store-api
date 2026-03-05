import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Movement, ProductStatus, UseCase, WatchType } from '@prisma/client';
import { Transform } from 'class-transformer';
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
} from 'class-validator';

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
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity', example: 10 })
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
  @IsInt()
  @Min(0)
  discountPercentage?: number;

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
