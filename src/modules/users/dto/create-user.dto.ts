import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'user123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

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
    description: 'Google ID para login social',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiPropertyOptional({
    description: 'Array de IDs de roles do usuário',
    example: ['role-uuid-1', 'role-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  roleIds?: string[];
}
