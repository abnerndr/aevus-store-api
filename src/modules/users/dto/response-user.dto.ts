import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDTO {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @ApiProperty({
    description: 'Se o usuário está verificado',
    example: true,
  })
  isVerified: boolean;

  @ApiProperty({
    description: 'Roles do usuário',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização do usuário',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  // Campos sensíveis excluídos da resposta
  @Exclude()
  password?: string;

  @Exclude()
  refreshToken?: string;

  @Exclude()
  verificationToken?: string;

  @Exclude()
  resetPasswordToken?: string;

  @Exclude()
  resetPasswordExpires?: Date;

  @Exclude()
  magicLinkToken?: string;

  @Exclude()
  magicLinkExpires?: Date;
}

export class UserListResponseDTO {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserResponseDTO],
  })
  data: UserResponseDTO[];

  @ApiProperty({
    description: 'Total de usuários',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Itens por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;
}
