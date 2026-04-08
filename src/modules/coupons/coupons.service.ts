import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDTO } from './dto/create-coupon.dto';
import { QueryCouponDTO } from './dto/query-coupon.dto';
import { CouponListResponseDTO, CouponResponseDTO } from './dto/response-coupon.dto';
import { UpdateCouponDTO } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCouponDTO): Promise<CouponResponseDTO> {
    const code = dto.code.trim().toUpperCase();
    await this.ensureCodeAvailable(code);

    const coupon = await this.prisma.coupon.create({
      data: {
        id: uuidv7(),
        code,
        description: dto.description ?? null,
        type: dto.type,
        value: dto.value,
        minimumOrderAmount: dto.minimumOrderAmount ?? null,
        maxUses: dto.maxUses ?? null,
        isActive: dto.isActive ?? true,
        startsAt: dto.startsAt ?? null,
        endsAt: dto.endsAt ?? null,
      },
    });

    return this.format(coupon);
  }

  async findAll(query: QueryCouponDTO): Promise<CouponListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: Prisma.CouponWhereInput = search
      ? {
          OR: [
            { code: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      data: items.map((item) => this.format(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CouponResponseDTO> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Cupom não encontrado.');
    }

    return this.format(coupon);
  }

  async update(id: string, dto: UpdateCouponDTO): Promise<CouponResponseDTO> {
    await this.findById(id);

    if (dto.code) {
      await this.ensureCodeAvailable(dto.code.trim().toUpperCase(), id);
    }

    const coupon = await this.prisma.coupon.update({
      where: { id },
      data: {
        ...(dto.code !== undefined ? { code: dto.code.trim().toUpperCase() } : {}),
        ...(dto.description !== undefined ? { description: dto.description || null } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.minimumOrderAmount !== undefined
          ? { minimumOrderAmount: dto.minimumOrderAmount }
          : {}),
        ...(dto.maxUses !== undefined ? { maxUses: dto.maxUses } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.startsAt !== undefined ? { startsAt: dto.startsAt } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt } : {}),
      },
    });

    return this.format(coupon);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.coupon.delete({ where: { id } });
  }

  private async ensureCodeAvailable(code: string, ignoreId?: string): Promise<void> {
    const existing = await this.prisma.coupon.findFirst({
      where: {
        code,
        ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
      },
    });

    if (existing) {
      throw new ConflictException('Já existe um cupom com este código.');
    }
  }

  private format(coupon: {
    id: string;
    code: string;
    description: string | null;
    type: Prisma.CouponScalarFieldEnum extends never ? never : any;
    value: Prisma.Decimal;
    minimumOrderAmount: Prisma.Decimal | null;
    maxUses: number | null;
    usedCount: number;
    isActive: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): CouponResponseDTO {
    return {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description ?? undefined,
      type: coupon.type,
      value: Number(coupon.value),
      minimumOrderAmount: coupon.minimumOrderAmount
        ? Number(coupon.minimumOrderAmount)
        : undefined,
      maxUses: coupon.maxUses ?? undefined,
      usedCount: coupon.usedCount,
      isActive: coupon.isActive,
      startsAt: coupon.startsAt ?? undefined,
      endsAt: coupon.endsAt ?? undefined,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    };
  }
}
