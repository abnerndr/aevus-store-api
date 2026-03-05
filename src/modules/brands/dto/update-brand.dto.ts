import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBrandDTO {
  @ApiPropertyOptional({ description: 'Brand name', example: 'Rolex' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Brand description', example: 'Swiss luxury watchmaker' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
