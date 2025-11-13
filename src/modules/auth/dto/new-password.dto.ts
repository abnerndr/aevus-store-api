import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class NewPasswordDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de recuperação de senha recebido por email',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: 'myNewSecurePassword123',
    description: 'Nova senha (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
