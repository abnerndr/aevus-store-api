import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeatureDTO } from './dto/create-feature.dto';
import { QueryFeatureDTO } from './dto/query-feature.dto';
import { FeatureListResponseDTO, FeatureResponseDTO } from './dto/response-feature.dto';
import { UpdateFeatureDTO } from './dto/update-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeatureDTO): Promise<FeatureResponseDTO> {
    const existing = await this.prisma.feature.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Feature already exists');
    const item = await this.prisma.feature.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(item);
  }

  async findAll(query: QueryFeatureDTO): Promise<FeatureListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};
    const [items, total] = await Promise.all([
      this.prisma.feature.findMany({ where, orderBy: { [sortBy]: sortOrder.toLowerCase() }, skip: (page - 1) * limit, take: limit }),
      this.prisma.feature.count({ where }),
    ]);
    return { data: items.map((i) => this.format(i)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<FeatureResponseDTO> {
    const item = await this.prisma.feature.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Feature not found');
    return this.format(item);
  }

  async update(id: string, dto: UpdateFeatureDTO): Promise<FeatureResponseDTO> {
    await this.findById(id);
    if (dto.name) {
      const conflict = await this.prisma.feature.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Feature name already in use');
    }
    const updated = await this.prisma.feature.update({
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
    await this.prisma.feature.delete({ where: { id } });
  }

  private format(item: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): FeatureResponseDTO {
    return { id: item.id, name: item.name, description: item.description ?? undefined, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }
}
