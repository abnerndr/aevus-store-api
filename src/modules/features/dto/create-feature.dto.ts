import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFeatureDTO {
  @ApiProperty({ description: 'Feature name', example: 'Sapphire Crystal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Watch feature description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
