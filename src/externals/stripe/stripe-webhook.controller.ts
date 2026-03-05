import { Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../modules/auth/decorators/public.decorator';
import { WebhookService } from './webhook.service';

@ApiTags('Stripe Webhooks')
@Controller('webhooks/stripe')
@Public()
export class StripeWebhookController {
  constructor(private webhookService: WebhookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook do Stripe',
    description:
      'Endpoint para receber eventos do Stripe. Processa eventos de checkout, assinaturas e pagamentos.',
  })
  @ApiHeader({
    name: 'stripe-signature',
    description: 'Assinatura do webhook do Stripe para verificação',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processado com sucesso',
    schema: {
      type: 'object',
      properties: {
        received: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Assinatura inválida ou evento não reconhecido' })
  @ApiResponse({ status: 500, description: 'Erro ao processar webhook' })
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    console.log('req', req);
    return await this.webhookService.handleWebhook(req, signature);
  }
}
