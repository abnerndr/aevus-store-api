import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class MagicLinkDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email para enviar o magic link',
    format: 'email',
  })
  @IsEmail()
  email: string;
}

export class MagicLinkLoginDTO {
  @ApiProperty({
    example: '50cf93bae54d0dd9ef4007815517353a53e2f7...',
    description: 'Token do magic link',
  })
  @IsString()
  token: string;
}
