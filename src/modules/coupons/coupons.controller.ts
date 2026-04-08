import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  CreateCoupons,
  DeleteCoupons,
  ReadCoupons,
  UpdateCoupons,
} from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { CouponsService } from './coupons.service';
import { CreateCouponDTO } from './dto/create-coupon.dto';
import { QueryCouponDTO } from './dto/query-coupon.dto';
import { CouponListResponseDTO, CouponResponseDTO } from './dto/response-coupon.dto';
import { UpdateCouponDTO } from './dto/update-coupon.dto';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('api/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @CreateCoupons()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Criar cupom' })
  @ApiBody({ type: CreateCouponDTO })
  @ApiResponse({ status: 201, type: CouponResponseDTO })
  create(@Body() dto: CreateCouponDTO): Promise<CouponResponseDTO> {
    return this.couponsService.create(dto);
  }

  @Get()
  @ReadCoupons()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar cupons' })
  @ApiResponse({ status: 200, type: CouponListResponseDTO })
  findAll(@Query() query: QueryCouponDTO): Promise<CouponListResponseDTO> {
    return this.couponsService.findAll(query);
  }

  @Get(':id')
  @ReadCoupons()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Buscar cupom por ID' })
  @ApiParam({ name: 'id', description: 'UUID do cupom' })
  @ApiResponse({ status: 200, type: CouponResponseDTO })
  findOne(@Param('id') id: string): Promise<CouponResponseDTO> {
    return this.couponsService.findById(id);
  }

  @Put(':id')
  @UpdateCoupons()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Atualizar cupom' })
  @ApiParam({ name: 'id', description: 'UUID do cupom' })
  @ApiBody({ type: UpdateCouponDTO })
  @ApiResponse({ status: 200, type: CouponResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDTO): Promise<CouponResponseDTO> {
    return this.couponsService.update(id, dto);
  }

  @Delete(':id')
  @DeleteCoupons()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cupom' })
  @ApiParam({ name: 'id', description: 'UUID do cupom' })
  delete(@Param('id') id: string): Promise<void> {
    return this.couponsService.delete(id);
  }
}
