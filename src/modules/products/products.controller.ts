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
  CreateProducts,
  DeleteProducts,
  UpdateProducts,
} from '../auth/decorators/check-abilities.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDTO } from './dto/create-product.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { ProductListResponseDTO, ProductResponseDTO } from './dto/response-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('api/products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @CreateProducts()
  @ApiOperation({ summary: 'Create a new watch product' })
  @ApiBody({ type: CreateProductDTO })
  @ApiResponse({ status: 201, type: ProductResponseDTO })
  create(@Body() dto: CreateProductDTO): Promise<ProductResponseDTO> {
    return this.productsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List products with filters and pagination' })
  @ApiResponse({ status: 200, type: ProductListResponseDTO })
  findAll(@Query() query: QueryProductDTO): Promise<ProductListResponseDTO> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, type: ProductResponseDTO })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id') id: string): Promise<ProductResponseDTO> {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @UpdateProducts()
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiBody({ type: UpdateProductDTO })
  @ApiResponse({ status: 200, type: ProductResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @DeleteProducts()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  delete(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }
}
