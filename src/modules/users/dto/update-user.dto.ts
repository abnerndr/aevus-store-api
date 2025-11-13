import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL do avatar do usuário',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Se o usuário está verificado',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Array de IDs de roles do usuário',
    example: ['role-uuid-1', 'role-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  roleIds?: string[];
}
