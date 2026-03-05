import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FactoryResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class FactoryListResponseDTO {
  @ApiProperty({ type: [FactoryResponseDTO] }) data: FactoryResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
