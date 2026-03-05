import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateFactories, DeleteFactories, UpdateFactories } from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { FactoriesService } from './factories.service';
import { CreateFactoryDTO } from './dto/create-factorie.dto';
import { QueryFactoryDTO } from './dto/query-factorie.dto';
import { FactoryListResponseDTO, FactoryResponseDTO } from './dto/response-factorie.dto';
import { UpdateFactoryDTO } from './dto/update-factorie.dto';

@ApiTags('Factories')
@Controller('api/factories')
export class FactoriesController {
  constructor(private readonly factoriesService: FactoriesService) {}

  @Post()
  @ApiBearerAuth()
  @CreateFactories()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new factory' })
  @ApiBody({ type: CreateFactoryDTO })
  @ApiResponse({ status: 201, type: FactoryResponseDTO })
  create(@Body() dto: CreateFactoryDTO): Promise<FactoryResponseDTO> {
    return this.factoriesService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all factories' })
  @ApiResponse({ status: 200, type: FactoryListResponseDTO })
  findAll(@Query() query: QueryFactoryDTO): Promise<FactoryListResponseDTO> {
    return this.factoriesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get factory by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: FactoryResponseDTO })
  findOne(@Param('id') id: string): Promise<FactoryResponseDTO> {
    return this.factoriesService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateFactories()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update factory' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateFactoryDTO })
  @ApiResponse({ status: 200, type: FactoryResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateFactoryDTO): Promise<FactoryResponseDTO> {
    return this.factoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteFactories()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete factory' })
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: string): Promise<void> {
    return this.factoriesService.delete(id);
  }
}
