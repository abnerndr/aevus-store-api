import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDTO {
  @ApiProperty({
    example: 'Email de verificação enviado com sucesso',
    description: 'Mensagem de sucesso',
  })
  message: string;
}
