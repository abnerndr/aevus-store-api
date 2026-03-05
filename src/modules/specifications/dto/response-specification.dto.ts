import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpecificationResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class SpecificationListResponseDTO {
  @ApiProperty({ type: [SpecificationResponseDTO] }) data: SpecificationResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
