import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CreateCategories, DeleteCategories, UpdateCategories } from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { QueryCategoryDTO } from './dto/query-category.dto';
import { CategoryListResponseDTO, CategoryResponseDTO } from './dto/response-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @CreateCategories()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDTO })
  @ApiResponse({ status: 201, type: CategoryResponseDTO })
  create(@Body() dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({ status: 200, type: CategoryListResponseDTO })
  findAll(@Query() query: QueryCategoryDTO): Promise<CategoryListResponseDTO> {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: CategoryResponseDTO })
  findOne(@Param('id') id: string): Promise<CategoryResponseDTO> {
    return this.categoriesService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UpdateCategories()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Update category' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateCategoryDTO })
  @ApiResponse({ status: 200, type: CategoryResponseDTO })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDTO): Promise<CategoryResponseDTO> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @DeleteCategories()
  @UseGuards(AbilitiesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiParam({ name: 'id' })
  delete(@Param('id') id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
