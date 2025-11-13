import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de verificação de email recebido por email',
  })
  @IsString()
  token: string;
}
