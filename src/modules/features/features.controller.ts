import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateFeatures, DeleteFeatures, UpdateFeatures } from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { FeaturesService } from './features.service';
import { CreateFeatureDTO } from './dto/create-feature.dto';
import { QueryFeatureDTO } from './dto/query-feature.dto';
import { FeatureListResponseDTO, FeatureResponseDTO } from './dto/response-feature.dto';
import { UpdateFeatureDTO } from './dto/update-feature.dto';

@ApiTags('Features')
@Controller('api/features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @ApiBearerAuth()
  @CreateFeatures()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new feature' })
  @ApiBody({ type: CreateFeatureDTO })
  @ApiResponse({ status: 201, type: FeatureResponseDTO })
  create(@Body() dto: CreateFeatureDTO): Promise<FeatureResponseDTO> {
    return this.featuresService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all features' })
  @ApiResponse({ status: 200, type: FeatureListResponseDTO })
  findAll(@Query() query: QueryFeatureDTO): Promise<FeatureListResponseDTO> {
    return this.featuresService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: FeatureResponseDTO })
  findOne(@Param('id') id: string): Promise<FeatureResponseDTO> {
    return this.featuresService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateFeatures()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update feature' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateFeatureDTO })
  @ApiResponse({ status: 200, type: FeatureResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateFeatureDTO): Promise<FeatureResponseDTO> {
    return this.featuresService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteFeatures()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete feature' })
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: string): Promise<void> {
    return this.featuresService.delete(id);
  }
}
