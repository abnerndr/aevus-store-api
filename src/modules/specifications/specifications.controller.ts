import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateSpecifications, DeleteSpecifications, UpdateSpecifications } from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { SpecificationsService } from './specifications.service';
import { CreateSpecificationDTO } from './dto/create-specification.dto';
import { QuerySpecificationDTO } from './dto/query-specification.dto';
import { SpecificationListResponseDTO, SpecificationResponseDTO } from './dto/response-specification.dto';
import { UpdateSpecificationDTO } from './dto/update-specification.dto';

@ApiTags('Specifications')
@Controller('api/specifications')
export class SpecificationsController {
  constructor(private readonly specificationsService: SpecificationsService) {}

  @Post()
  @ApiBearerAuth()
  @CreateSpecifications()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new specification' })
  @ApiBody({ type: CreateSpecificationDTO })
  @ApiResponse({ status: 201, type: SpecificationResponseDTO })
  create(@Body() dto: CreateSpecificationDTO): Promise<SpecificationResponseDTO> {
    return this.specificationsService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all specifications' })
  @ApiResponse({ status: 200, type: SpecificationListResponseDTO })
  findAll(@Query() query: QuerySpecificationDTO): Promise<SpecificationListResponseDTO> {
    return this.specificationsService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get specification by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: SpecificationResponseDTO })
  findOne(@Param('id') id: string): Promise<SpecificationResponseDTO> {
    return this.specificationsService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateSpecifications()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update specification' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateSpecificationDTO })
  @ApiResponse({ status: 200, type: SpecificationResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateSpecificationDTO): Promise<SpecificationResponseDTO> {
    return this.specificationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteSpecifications()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete specification' })
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: string): Promise<void> {
    return this.specificationsService.delete(id);
  }
}
