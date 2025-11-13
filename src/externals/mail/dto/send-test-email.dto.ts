import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTestEmailDTO {
  @ApiProperty({ example: 'test@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsOptional()
  name?: string;
}
