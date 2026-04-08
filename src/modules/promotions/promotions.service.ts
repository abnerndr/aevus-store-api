import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePromotionDTO } from './dto/create-promotion.dto';
import { QueryPromotionDTO } from './dto/query-promotion.dto';
import {
  PromotionListResponseDTO,
  PromotionResponseDTO,
} from './dto/response-promotion.dto';
import { UpdatePromotionDTO } from './dto/update-promotion.dto';

const PROMOTION_INCLUDE = {
  products: {
    select: {
      id: true,
      name: true,
    },
  },
} as const;

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromotionDTO): Promise<PromotionResponseDTO> {
    const promotion = await this.prisma.promotion.create({
      data: {
        id: uuidv7(),
        name: dto.name,
        description: dto.description ?? null,
        type: dto.type,
        value: dto.value,
        isActive: dto.isActive ?? true,
        startsAt: dto.startsAt ?? null,
        endsAt: dto.endsAt ?? null,
        ...(dto.productIds?.length
          ? { products: { connect: dto.productIds.map((id) => ({ id })) } }
          : {}),
      },
      include: PROMOTION_INCLUDE,
    });

    return this.format(promotion);
  }

  async findAll(query: QueryPromotionDTO): Promise<PromotionListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: Prisma.PromotionWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: PROMOTION_INCLUDE,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.promotion.count({ where }),
    ]);

    return {
      data: items.map((item) => this.format(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<PromotionResponseDTO> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: PROMOTION_INCLUDE,
    });

    if (!promotion) {
      throw new NotFoundException('Promoção não encontrada.');
    }

    return this.format(promotion);
  }

  async update(id: string, dto: UpdatePromotionDTO): Promise<PromotionResponseDTO> {
    await this.findById(id);

    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description || null } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.startsAt !== undefined ? { startsAt: dto.startsAt } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt } : {}),
        ...(dto.productIds !== undefined
          ? { products: { set: dto.productIds.map((productId) => ({ id: productId })) } }
          : {}),
      },
      include: PROMOTION_INCLUDE,
    });

    return this.format(promotion);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.promotion.delete({ where: { id } });
  }

  private format(promotion: {
    id: string;
    name: string;
    description: string | null;
    type: Prisma.PromotionScalarFieldEnum extends never ? never : any;
    value: Prisma.Decimal;
    isActive: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    products: Array<{ id: string; name: string }>;
  }): PromotionResponseDTO {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description ?? undefined,
      type: promotion.type,
      value: Number(promotion.value),
      isActive: promotion.isActive,
      startsAt: promotion.startsAt ?? undefined,
      endsAt: promotion.endsAt ?? undefined,
      products: promotion.products,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    };
  }
}
