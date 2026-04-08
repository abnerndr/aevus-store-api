import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDTO {
  @ApiProperty() id: string;
  @ApiProperty() fullName: string;
  @ApiProperty() email: string;
  @ApiProperty() phone: string;
  @ApiProperty() cpf: string;
  @ApiProperty() postalCode: string;
  @ApiProperty() street: string;
  @ApiProperty() neighborhood: string;
  @ApiProperty() number: string;
  @ApiPropertyOptional() complement?: string;
  @ApiProperty() city: string;
  @ApiProperty() state: string;
  @ApiProperty() fullAddress: string;
  @ApiProperty() ordersCount: number;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}

export class CustomerListResponseDTO {
  @ApiProperty({ type: [CustomerResponseDTO] }) data: CustomerResponseDTO[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
}
