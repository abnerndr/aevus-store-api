import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { QuerySupplierDTO } from './dto/query-supplier.dto';
import { SupplierListResponseDTO, SupplierResponseDTO } from './dto/response-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSupplierDTO): Promise<SupplierResponseDTO> {
    const existing = await this.prisma.supplier.findFirst({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Supplier already exists');
    const item = await this.prisma.supplier.create({
      data: { id: uuidv7(), name: dto.name, description: dto.description ?? null },
    });
    return this.format(item);
  }

  async findAll(query: QuerySupplierDTO): Promise<SupplierListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'name', sortOrder = 'ASC' } = query;
    const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};
    const [items, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, orderBy: { [sortBy]: sortOrder.toLowerCase() }, skip: (page - 1) * limit, take: limit }),
      this.prisma.supplier.count({ where }),
    ]);
    return { data: items.map((i) => this.format(i)), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<SupplierResponseDTO> {
    const item = await this.prisma.supplier.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Supplier not found');
    return this.format(item);
  }

  async update(id: string, dto: UpdateSupplierDTO): Promise<SupplierResponseDTO> {
    await this.findById(id);
    if (dto.name) {
      const conflict = await this.prisma.supplier.findFirst({ where: { name: dto.name, NOT: { id } } });
      if (conflict) throw new ConflictException('Supplier name already in use');
    }
    const updated = await this.prisma.supplier.update({
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
    await this.prisma.supplier.delete({ where: { id } });
  }

  private format(item: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date }): SupplierResponseDTO {
    return { id: item.id, name: item.name, description: item.description ?? undefined, createdAt: item.createdAt, updatedAt: item.updatedAt };
  }
}
