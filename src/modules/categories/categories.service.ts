import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { QueryCategoryDTO } from './dto/query-category.dto';
import { CategoryListResponseDTO, CategoryResponseDTO } from './dto/response-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const existing = await this.prisma.category.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Category already exists');

    const item = await this.prisma.category.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(item);
  }

  async findAll(query: QueryCategoryDTO): Promise<CategoryListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { data: items.map((i) => this.format(i)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<CategoryResponseDTO> {
    const item = await this.prisma.category.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Category not found');
    return this.format(item);
  }

  async update(id: string, dto: UpdateCategoryDTO): Promise<CategoryResponseDTO> {
    await this.findById(id);
    if (dto.name) {
      const conflict = await this.prisma.category.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Category name already in use');
    }
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
      },
    });
    return this.format(updated);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.category.delete({ where: { id } });
  }

  private format(item: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): CategoryResponseDTO {
    return { id: item.id, name: item.name, description: item.description ?? undefined, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }
}
