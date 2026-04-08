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
  CreateCustomers,
  DeleteCustomers,
  ReadCustomers,
  UpdateCustomers,
} from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { QueryCustomerDTO } from './dto/query-customer.dto';
import { CustomerListResponseDTO, CustomerResponseDTO } from './dto/response-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('api/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @CreateCustomers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Criar cliente' })
  @ApiBody({ type: CreateCustomerDTO })
  @ApiResponse({ status: 201, type: CustomerResponseDTO })
  create(@Body() dto: CreateCustomerDTO): Promise<CustomerResponseDTO> {
    return this.customersService.create(dto);
  }

  @Get()
  @ReadCustomers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({ status: 200, type: CustomerListResponseDTO })
  findAll(@Query() query: QueryCustomerDTO): Promise<CustomerListResponseDTO> {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @ReadCustomers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  @ApiResponse({ status: 200, type: CustomerResponseDTO })
  findOne(@Param('id') id: string): Promise<CustomerResponseDTO> {
    return this.customersService.findById(id);
  }

  @Put(':id')
  @UpdateCustomers()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Atualizar cliente' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  @ApiBody({ type: UpdateCustomerDTO })
  @ApiResponse({ status: 200, type: CustomerResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @DeleteCustomers()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cliente' })
  @ApiParam({ name: 'id', description: 'UUID do cliente' })
  delete(@Param('id') id: string): Promise<void> {
    return this.customersService.delete(id);
  }
}
