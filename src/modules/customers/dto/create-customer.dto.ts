import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCustomerDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  fullName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  cpf: string;

  @ApiProperty({ example: '01234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  postalCode: string;

  @ApiProperty({ example: 'Rua das Flores' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @ApiProperty({ example: 'Centro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  neighborhood: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @ApiPropertyOptional({ example: 'Apto 45' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  complement?: string;

  @ApiProperty({ example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  state: string;

  @ApiPropertyOptional({
    example: 'Rua das Flores, 123, Centro, São Paulo - SP, CEP 01234567',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fullAddress?: string;
}
