import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDTO } from '../permission/response-permission.dto';

export class RoleResponseDTO {
  @ApiProperty({
    description: 'ID único da role',
    example: 'uuid-role-id',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da role',
    example: 'admin',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição da role',
    example: 'System Administrator',
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

  @ApiProperty({
    description: 'Permissões associadas à role',
    type: [Object],
  })
  permissions: PermissionResponseDTO[];
}

export class RoleListResponseDTO {
  @ApiProperty({
    description: 'Lista de roles',
    type: [RoleResponseDTO],
  })
  roles: RoleResponseDTO[];

  @ApiProperty({
    description: 'Total de roles',
    example: 10,
  })
  total: number;
}
