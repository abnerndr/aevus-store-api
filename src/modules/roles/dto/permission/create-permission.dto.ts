import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @ApiProperty({
    description: 'Nome único da permissão',
    example: 'users:create',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Recurso da permissão',
    example: 'user',
    enum: ['user', 'role', 'permission', 'all'],
  })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({
    description: 'Ação da permissão',
    example: 'create',
    enum: ['create', 'read', 'update', 'delete', 'manage'],
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({
    description: 'Descrição da permissão',
    example: 'Create new users',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
