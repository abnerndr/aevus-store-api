import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsString } from 'class-validator';

export class UserProfileDTO {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único do usuário',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Status de verificação do email',
  })
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Data de criação da conta',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-20T14:22:00Z',
    description: 'Data da última atualização',
  })
  @IsDateString()
  updatedAt: Date;
}
