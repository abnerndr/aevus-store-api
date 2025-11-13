import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthDTO {
  @ApiProperty({
    example: 'ya29.a0ARrdaM9Q7yFGjKr8s...',
    description: 'Token de acesso do Google OAuth',
  })
  @IsString()
  googleToken: string;
}
