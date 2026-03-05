import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBrandDTO } from './dto/create-brand.dto';
import { QueryBrandDTO } from './dto/query-brand.dto';
import { BrandListResponseDTO, BrandResponseDTO } from './dto/response-brand.dto';
import { UpdateBrandDTO } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDTO): Promise<BrandResponseDTO> {
    const existing = await this.prisma.brand.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Brand already exists');

    const brand = await this.prisma.brand.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(brand);
  }

  async findAll(query: QueryBrandDTO): Promise<BrandListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};

    const [items, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data: items.map((b) => this.format(b)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<BrandResponseDTO> {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return this.format(brand);
  }

  async update(id: string, dto: UpdateBrandDTO): Promise<BrandResponseDTO> {
    await this.findById(id);

    if (dto.name) {
      const conflict = await this.prisma.brand.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Brand name already in use');
    }

    const updated = await this.prisma.brand.update({
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
    await this.prisma.brand.delete({ where: { id } });
  }

  private format(brand: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): BrandResponseDTO {
    return {
      id: brand.id,
      name: brand.name,
      description: brand.description ?? undefined,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }
}
