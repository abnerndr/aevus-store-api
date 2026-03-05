import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFactoryDTO } from './dto/create-factorie.dto';
import { QueryFactoryDTO } from './dto/query-factorie.dto';
import { FactoryListResponseDTO, FactoryResponseDTO } from './dto/response-factorie.dto';
import { UpdateFactoryDTO } from './dto/update-factorie.dto';

@Injectable()
export class FactoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFactoryDTO): Promise<FactoryResponseDTO> {
    const existing = await this.prisma.factory.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Factory already exists');
    const item = await this.prisma.factory.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(item);
  }

  async findAll(query: QueryFactoryDTO): Promise<FactoryListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};
    const [items, total] = await Promise.all([
      this.prisma.factory.findMany({ where, orderBy: { [sortBy]: sortOrder.toLowerCase() }, skip: (page - 1) * limit, take: limit }),
      this.prisma.factory.count({ where }),
    ]);
    return { data: items.map((i) => this.format(i)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<FactoryResponseDTO> {
    const item = await this.prisma.factory.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Factory not found');
    return this.format(item);
  }

  async update(id: string, dto: UpdateFactoryDTO): Promise<FactoryResponseDTO> {
    await this.findById(id);
    if (dto.name) {
      const conflict = await this.prisma.factory.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Factory name already in use');
    }
    const updated = await this.prisma.factory.update({
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
    await this.prisma.factory.delete({ where: { id } });
  }

  private format(item: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): FactoryResponseDTO {
    return { id: item.id, name: item.name, description: item.description ?? undefined, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }
}
