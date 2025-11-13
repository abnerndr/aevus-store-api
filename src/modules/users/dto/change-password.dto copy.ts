import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'user123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'user456',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Nova senha deve ter pelo menos 6 caracteres' })
  newPassword: string;
}
