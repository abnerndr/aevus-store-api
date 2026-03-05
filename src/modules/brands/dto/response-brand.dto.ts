import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandResponseDTO {
  @ApiProperty({ example: '018e8e1e-1234-7000-8000-abcdef012345' })
  id: string;

  @ApiProperty({ example: 'Rolex' })
  name: string;

  @ApiPropertyOptional({ example: 'Swiss luxury watchmaker' })
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class BrandListResponseDTO {
  @ApiProperty({ type: [BrandResponseDTO] })
  data: BrandResponseDTO[];

  @ApiProperty({ example: 20 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 2 })
  totalPages: number;
}
