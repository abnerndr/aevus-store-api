import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFactoryDTO {
  @ApiProperty({ description: 'Factory name', example: 'Dandong Factory' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Watch manufacturer' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
