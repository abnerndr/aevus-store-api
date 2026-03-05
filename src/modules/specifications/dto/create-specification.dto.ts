import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSpecificationDTO {
  @ApiProperty({ description: 'Specification name', example: 'Water Resistant 100m' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Technical specification' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
