import { ApiPropertyOptional } from '@nestjs/swagger';
import { Movement, ProductStatus, UseCase, WatchType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryProductDTO {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by name or model' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ enum: WatchType })
  @IsOptional()
  @IsEnum(WatchType)
  watchType?: WatchType;

  @ApiPropertyOptional({ enum: Movement })
  @IsOptional()
  @IsEnum(Movement)
  movement?: Movement;

  @ApiPropertyOptional({ enum: UseCase })
  @IsOptional()
  @IsEnum(UseCase)
  useCase?: UseCase;

  @ApiPropertyOptional({ description: 'Filter by brand UUID' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(String(value)))
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(String(value)))
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isNew?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isDiscounted?: boolean;

  @ApiPropertyOptional({
    enum: ['name', 'model', 'price', 'stock', 'createdAt'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
