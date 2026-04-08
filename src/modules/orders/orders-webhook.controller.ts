import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { Public } from '../auth/decorators/public.decorator';
import { InfinitePayWebhookResponseDTO } from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('InfinitePay Webhooks')
@Controller('webhooks/infinitepay')
@Public()
export class OrdersWebhookController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Receber webhook de pagamento da InfinitePay' })
  @ApiResponse({ status: 200, type: InfinitePayWebhookResponseDTO })
  @ApiResponse({ status: 400, type: InfinitePayWebhookResponseDTO })
  async handleWebhook(
    @Body() payload: Record<string, unknown>,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<InfinitePayWebhookResponseDTO> {
    const result = await this.ordersService.handleInfinitePayWebhook(payload);

    reply.status(result.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    return result;
  }
}
