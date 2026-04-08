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
  CreatePromotions,
  DeletePromotions,
  ReadPromotions,
  UpdatePromotions,
} from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { QueryPromotionDTO } from './dto/query-promotion.dto';
import {
  PromotionListResponseDTO,
  PromotionResponseDTO,
} from './dto/response-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('api/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @CreatePromotions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Criar promoção' })
  @ApiBody({ type: CreatePromotionDTO })
  @ApiResponse({ status: 201, type: PromotionResponseDTO })
  create(@Body() dto: CreatePromotionDTO): Promise<PromotionResponseDTO> {
    return this.promotionsService.create(dto);
  }

  @Get()
  @ReadPromotions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar promoções' })
  @ApiResponse({ status: 200, type: PromotionListResponseDTO })
  findAll(@Query() query: QueryPromotionDTO): Promise<PromotionListResponseDTO> {
    return this.promotionsService.findAll(query);
  }

  @Get(':id')
  @ReadPromotions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Buscar promoção por ID' })
  @ApiParam({ name: 'id', description: 'UUID da promoção' })
  @ApiResponse({ status: 200, type: PromotionResponseDTO })
  findOne(@Param('id') id: string): Promise<PromotionResponseDTO> {
    return this.promotionsService.findById(id);
  }

  @Put(':id')
  @UpdatePromotions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Atualizar promoção' })
  @ApiParam({ name: 'id', description: 'UUID da promoção' })
  @ApiBody({ type: UpdatePromotionDTO })
  @ApiResponse({ status: 200, type: PromotionResponseDTO })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePromotionDTO,
  ): Promise<PromotionResponseDTO> {
    return this.promotionsService.update(id, dto);
  }

  @Delete(':id')
  @DeletePromotions()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir promoção' })
  @ApiParam({ name: 'id', description: 'UUID da promoção' })
  delete(@Param('id') id: string): Promise<void> {
    return this.promotionsService.delete(id);
  }
}
