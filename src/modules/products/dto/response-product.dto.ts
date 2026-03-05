import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Movement, ProductStatus, UseCase, WatchType } from '@prisma/client';

class RelationItemDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiPropertyOptional() description?: string;
}

class BrandItemDTO extends RelationItemDTO {}

export class ProductResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() model: string;
  @ApiProperty({ enum: ProductStatus }) status: ProductStatus;
  @ApiPropertyOptional() description?: string;
  @ApiProperty() price: number;
  @ApiProperty() stock: number;
  @ApiProperty({ type: [String] }) images: string[];
  @ApiProperty({ type: [String] }) tags: string[];

  // Watch specs
  @ApiProperty({ enum: WatchType }) watchType: WatchType;
  @ApiProperty() caseMaterial: string;
  @ApiProperty() caseDiameter: string;
  @ApiProperty() crystalMaterial: string;
  @ApiProperty() strapMaterial: string;
  @ApiProperty({ enum: Movement }) movement: Movement;
  @ApiProperty({ enum: UseCase }) useCase: UseCase;

  // Highlights
  @ApiProperty() isFeatured: boolean;
  @ApiProperty() isNew: boolean;
  @ApiProperty() isBestSeller: boolean;
  @ApiProperty() isTopRated: boolean;
  @ApiProperty() isDiscounted: boolean;
  @ApiPropertyOptional() discountPercentage?: number;

  // Relations
  @ApiProperty({ type: BrandItemDTO }) brand: BrandItemDTO;
  @ApiProperty({ type: [RelationItemDTO] }) categories: RelationItemDTO[];
  @ApiProperty({ type: [RelationItemDTO] }) features: RelationItemDTO[];
  @ApiProperty({ type: [RelationItemDTO] }) specifications: RelationItemDTO[];
  @ApiProperty({ type: [RelationItemDTO] }) factories: RelationItemDTO[];
  @ApiProperty({ type: [RelationItemDTO] }) suppliers: RelationItemDTO[];

  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class ProductListResponseDTO {
  @ApiProperty({ type: [ProductResponseDTO] }) data: ProductResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
