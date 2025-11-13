import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email para recuperação de senha',
    format: 'email',
  })
  @IsEmail()
  email: string;
}
