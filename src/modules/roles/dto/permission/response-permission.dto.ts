import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDTO {
  @ApiProperty({
    description: 'ID único da permissão',
    example: 'uuid-permission-id',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da permissão',
    example: 'users:create',
  })
  name: string;

  @ApiProperty({
    description: 'Recurso da permissão',
    example: 'user',
  })
  resource: string;

  @ApiProperty({
    description: 'Ação da permissão',
    example: 'create',
  })
  action: string;

  @ApiProperty({
    description: 'Descrição da permissão',
    example: 'Create new users',
  })
  description: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PermissionListResponseDTO {
  @ApiProperty({
    description: 'Lista de permissões',
    type: [PermissionResponseDTO],
  })
  permissions: PermissionResponseDTO[];

  @ApiProperty({
    description: 'Total de permissões',
    example: 20,
  })
  total: number;
}
