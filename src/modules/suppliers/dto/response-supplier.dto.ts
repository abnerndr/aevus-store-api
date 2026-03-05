import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SupplierResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class SupplierListResponseDTO {
  @ApiProperty({ type: [SupplierResponseDTO] }) data: SupplierResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
