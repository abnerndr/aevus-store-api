import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSupplierDTO {
  @ApiProperty({ description: 'Supplier name', example: 'WatchSource Ltd' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Watch supplier' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
