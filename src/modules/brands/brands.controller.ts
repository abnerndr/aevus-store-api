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
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateBrands,
  DeleteBrands,
  UpdateBrands,
} from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { BrandsService } from './brands.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { QueryBrandDTO } from './dto/query-brand.dto';
import { BrandListResponseDTO, BrandResponseDTO } from './dto/response-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiBearerAuth()
  @CreateBrands()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: CreateBrandDTO })
  @ApiResponse({ status: 201, type: BrandResponseDTO })
  create(@Body() dto: CreateBrandDTO): Promise<BrandResponseDTO> {
    return this.brandsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all brands' })
  @ApiResponse({ status: 200, type: BrandListResponseDTO })
  findAll(@Query() query: QueryBrandDTO): Promise<BrandListResponseDTO> {
    return this.brandsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiResponse({ status: 200, type: BrandResponseDTO })
  findOne(@Param('id') id: string): Promise<BrandResponseDTO> {
    return this.brandsService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateBrands()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update brand' })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  @ApiBody({ type: UpdateBrandDTO })
  @ApiResponse({ status: 200, type: BrandResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateBrandDTO): Promise<BrandResponseDTO> {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteBrands()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete brand' })
  @ApiParam({ name: 'id', description: 'Brand UUID' })
  delete(@Param('id') id: string): Promise<void> {
    return this.brandsService.delete(id);
  }
}
