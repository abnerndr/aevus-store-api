import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeatureResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class FeatureListResponseDTO {
  @ApiProperty({ type: [FeatureResponseDTO] }) data: FeatureResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
