import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QuerySupplierDTO {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(String(value), 10))
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['name', 'createdAt'], default: 'name' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'name';

  @ApiPropertyOptional({ enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
