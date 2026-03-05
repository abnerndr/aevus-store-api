import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDTO {
  @ApiPropertyOptional({ description: 'Category name', example: 'Sport Watches' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Category description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
