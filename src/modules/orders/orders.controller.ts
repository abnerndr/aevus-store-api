import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ReadOrders,
  UpdateOrders,
} from '../auth/decorators/check-abilities.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import {
  CheckOrderPaymentDTO,
  CreateOrderDTO,
  OrderListResponseDTO,
  OrderResponseDTO,
  QueryOrderDTO,
  UpdateOrderDTO,
} from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @Public()
  @ApiOperation({ summary: 'Criar pedido e gerar checkout da InfinitePay' })
  @ApiBody({ type: CreateOrderDTO })
  @ApiResponse({ status: 201, type: OrderResponseDTO })
  createCheckout(@Body() dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    return this.ordersService.createCheckout(dto);
  }

  @Post('payment-check')
  @Public()
  @ApiOperation({ summary: 'Confirmar pagamento de um pedido na InfinitePay' })
  @ApiBody({ type: CheckOrderPaymentDTO })
  @ApiResponse({ status: 200, type: OrderResponseDTO })
  confirmPayment(@Body() dto: CheckOrderPaymentDTO): Promise<OrderResponseDTO> {
    return this.ordersService.confirmPayment(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ReadOrders()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar pedidos' })
  @ApiResponse({ status: 200, type: OrderListResponseDTO })
  findAll(@Query() query: QueryOrderDTO): Promise<OrderListResponseDTO> {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ReadOrders()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiParam({ name: 'id', description: 'UUID do pedido' })
  @ApiResponse({ status: 200, type: OrderResponseDTO })
  findOne(@Param('id') id: string): Promise<OrderResponseDTO> {
    return this.ordersService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateOrders()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Atualizar pedido' })
  @ApiParam({ name: 'id', description: 'UUID do pedido' })
  @ApiBody({ type: UpdateOrderDTO })
  @ApiResponse({ status: 200, type: OrderResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDTO): Promise<OrderResponseDTO> {
    return this.ordersService.update(id, dto);
  }
}
