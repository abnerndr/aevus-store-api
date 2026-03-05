import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDTO {
  @ApiProperty({ description: 'Category name', example: 'Sport Watches' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Durable watches for active lifestyles' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
