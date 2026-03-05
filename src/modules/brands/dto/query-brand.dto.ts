import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryBrandDTO {
  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by name', example: 'Rolex' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sort field', example: 'name', enum: ['name', 'createdAt'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiPropertyOptional({ description: 'Sort direction', enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
