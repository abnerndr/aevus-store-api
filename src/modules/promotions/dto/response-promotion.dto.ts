import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';

class PromotionProductDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
}

export class PromotionResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty({ enum: DiscountType }) type: DiscountType;
  @ApiProperty() value: number;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional() startsAt?: Date;
  @ApiPropertyOptional() endsAt?: Date;
  @ApiProperty({ type: [PromotionProductDTO] }) products: PromotionProductDTO[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class PromotionListResponseDTO {
  @ApiProperty({ type: [PromotionResponseDTO] }) data: PromotionResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
