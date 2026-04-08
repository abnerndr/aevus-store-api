import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from '@prisma/client';

export class CouponResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() code: string;
  @ApiPropertyOptional() description?: string;
  @ApiProperty({ enum: DiscountType }) type: DiscountType;
  @ApiProperty() value: number;
  @ApiPropertyOptional() minimumOrderAmount?: number;
  @ApiPropertyOptional() maxUses?: number;
  @ApiProperty() usedCount: number;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional() startsAt?: Date;
  @ApiPropertyOptional() endsAt?: Date;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class CouponListResponseDTO {
  @ApiProperty({ type: [CouponResponseDTO] }) data: CouponResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
