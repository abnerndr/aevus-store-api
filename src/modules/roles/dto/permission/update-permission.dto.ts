import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDTO {
  @ApiPropertyOptional({
    description: 'Nome único da permissão',
    example: 'users:read',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Recurso da permissão',
    example: 'user',
    enum: ['user', 'role', 'permission', 'all'],
  })
  @IsString()
  @IsOptional()
  resource?: string;

  @ApiPropertyOptional({
    description: 'Ação da permissão',
    example: 'read',
    enum: ['create', 'read', 'update', 'delete', 'manage'],
  })
  @IsString()
  @IsOptional()
  action?: string;

  @ApiPropertyOptional({
    description: 'Descrição da permissão',
    example: 'View users',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
