import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email do usuário',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'mySecurePassword123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;
}
