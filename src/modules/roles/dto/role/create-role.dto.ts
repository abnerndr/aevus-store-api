import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDTO {
  @ApiProperty({
    description: 'Nome único da role',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da role',
    example: 'System Administrator',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'IDs das permissões associadas à role',
    example: ['550e8400-e29b-41d4-a716-446655440000', '6ba7b810-9dad-11d1-80b4-00c04fd430c8'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  permissionIds?: string[];
}
