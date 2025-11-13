import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EmailTemplateDTO {
  @ApiProperty({ example: 'Welcome to Our Service', type: String })
  @IsString()
  subject: string;

  @ApiProperty({ example: '<h1>Welcome</h1>', type: String })
  @IsString()
  html: string;

  @ApiProperty({ example: 'Welcome to our service!', type: String })
  @IsString()
  @IsOptional()
  text?: string;
}
