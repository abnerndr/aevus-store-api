import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSpecificationDTO } from './dto/create-specification.dto';
import { QuerySpecificationDTO } from './dto/query-specification.dto';
import { SpecificationListResponseDTO, SpecificationResponseDTO } from './dto/response-specification.dto';
import { UpdateSpecificationDTO } from './dto/update-specification.dto';

@Injectable()
export class SpecificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecificationDTO): Promise<SpecificationResponseDTO> {
    const existing = await this.prisma.specification.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Specification already exists');
    const item = await this.prisma.specification.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(item);
  }

  async findAll(query: QuerySpecificationDTO): Promise<SpecificationListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};
    const [items, total] = await Promise.all([
      this.prisma.specification.findMany({ where, orderBy: { [sortBy]: sortOrder.toLowerCase() }, skip: (page - 1) * limit, take: limit }),
      this.prisma.specification.count({ where }),
    ]);
    return { data: items.map((i) => this.format(i)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<SpecificationResponseDTO> {
    const item = await this.prisma.specification.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Specification not found');
    return this.format(item);
  }

  async update(id: string, dto: UpdateSpecificationDTO): Promise<SpecificationResponseDTO> {
    await this.findById(id);
    if (dto.name) {
      const conflict = await this.prisma.specification.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Specification name already in use');
    }
    const updated = await this.prisma.specification.update({
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
    await this.prisma.specification.delete({ where: { id } });
  }

  private format(item: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): SpecificationResponseDTO {
    return { id: item.id, name: item.name, description: item.description ?? undefined, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }
}
