import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateSuppliers, DeleteSuppliers, UpdateSuppliers } from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { QuerySupplierDTO } from './dto/query-supplier.dto';
import { SupplierListResponseDTO, SupplierResponseDTO } from './dto/response-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';

@ApiTags('Suppliers')
@Controller('api/suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiBearerAuth()
  @CreateSuppliers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiBody({ type: CreateSupplierDTO })
  @ApiResponse({ status: 201, type: SupplierResponseDTO })
  create(@Body() dto: CreateSupplierDTO): Promise<SupplierResponseDTO> {
    return this.suppliersService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all suppliers' })
  @ApiResponse({ status: 200, type: SupplierListResponseDTO })
  findAll(@Query() query: QuerySupplierDTO): Promise<SupplierListResponseDTO> {
    return this.suppliersService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: SupplierResponseDTO })
  findOne(@Param('id') id: string): Promise<SupplierResponseDTO> {
    return this.suppliersService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateSuppliers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update supplier' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateSupplierDTO })
  @ApiResponse({ status: 200, type: SupplierResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDTO): Promise<SupplierResponseDTO> {
    return this.suppliersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteSuppliers()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete supplier' })
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: string): Promise<void> {
    return this.suppliersService.delete(id);
  }
}
