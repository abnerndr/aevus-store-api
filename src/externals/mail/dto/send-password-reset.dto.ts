import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendPasswordResetDTO {
  @ApiProperty({ example: 'test@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'The token of the user' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
