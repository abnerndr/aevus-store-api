import { ApiPropertyOptional } from '@nestjs/swagger';
import { Movement, ProductStatus, UseCase, WatchType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDTO {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(200) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) model?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: ProductStatus }) @IsOptional() @IsEnum(ProductStatus) status?: ProductStatus;
  @ApiPropertyOptional() @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) stock?: number;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];

  @ApiPropertyOptional({ enum: WatchType }) @IsOptional() @IsEnum(WatchType) watchType?: WatchType;
  @ApiPropertyOptional() @IsOptional() @IsString() caseMaterial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() caseDiameter?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() crystalMaterial?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() strapMaterial?: string;
  @ApiPropertyOptional({ enum: Movement }) @IsOptional() @IsEnum(Movement) movement?: Movement;
  @ApiPropertyOptional({ enum: UseCase }) @IsOptional() @IsEnum(UseCase) useCase?: UseCase;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isFeatured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isNew?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isBestSeller?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isTopRated?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isDiscounted?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) discountPercentage?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() brandId?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) categoryIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) featureIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) specificationIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) factoryIds?: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) supplierIds?: string[];
}
