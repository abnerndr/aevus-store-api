import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class CategoryListResponseDTO {
  @ApiProperty({ type: [CategoryResponseDTO] }) data: CategoryResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
