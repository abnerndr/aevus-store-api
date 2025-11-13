import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthResponseDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de acesso JWT',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de refresh para renovar o access token',
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'João Silva',
      emailVerified: true,
    },
    description: 'Dados do usuário',
  })
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  };
}
