import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandDTO {
  @ApiProperty({ description: 'Brand name', example: 'Rolex' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Brand description', example: 'Swiss luxury watchmaker' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
