import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { ProductListResponseDTO, ProductResponseDTO } from './dto/response-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

const PRODUCT_INCLUDE = {
  brand: true,
  categories: true,
  features: true,
  specifications: true,
  factories: true,
  suppliers: true,
} as const;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const product = await this.prisma.product.create({
      data: {
        id: uuidv7(),
        name: dto.name,
        model: dto.model,
        status: dto.status,
        description: dto.description ?? null,
        price: dto.price,
        stock: dto.stock,
        images: dto.images ?? [],
        tags: dto.tags ?? [],
        watchType: dto.watchType,
        caseMaterial: dto.caseMaterial,
        caseDiameter: dto.caseDiameter,
        crystalMaterial: dto.crystalMaterial,
        strapMaterial: dto.strapMaterial,
        movement: dto.movement,
        useCase: dto.useCase,
        isFeatured: dto.isFeatured ?? false,
        isNew: dto.isNew ?? false,
        isBestSeller: dto.isBestSeller ?? false,
        isTopRated: dto.isTopRated ?? false,
        isDiscounted: dto.isDiscounted ?? false,
        discountPercentage: dto.discountPercentage ?? null,
        brand: { connect: { id: dto.brandId } },
        ...(dto.categoryIds?.length
          ? { categories: { connect: dto.categoryIds.map((id) => ({ id })) } }
          : {}),
        ...(dto.featureIds?.length
          ? { features: { connect: dto.featureIds.map((id) => ({ id })) } }
          : {}),
        ...(dto.specificationIds?.length
          ? { specifications: { connect: dto.specificationIds.map((id) => ({ id })) } }
          : {}),
        ...(dto.factoryIds?.length
          ? { factories: { connect: dto.factoryIds.map((id) => ({ id })) } }
          : {}),
        ...(dto.supplierIds?.length
          ? { suppliers: { connect: dto.supplierIds.map((id) => ({ id })) } }
          : {}),
      },
      include: PRODUCT_INCLUDE,
    });

    return this.format(product);
  }

  async findAll(query: QueryProductDTO): Promise<ProductListResponseDTO> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      watchType,
      movement,
      useCase,
      brandId,
      minPrice,
      maxPrice,
      isFeatured,
      isNew,
      isDiscounted,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
      ...(watchType ? { watchType } : {}),
      ...(movement ? { movement } : {}),
      ...(useCase ? { useCase } : {}),
      ...(brandId ? { brandId } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: String(minPrice) } : {}),
              ...(maxPrice !== undefined ? { lte: String(maxPrice) } : {}),
            },
          }
        : {}),
      ...(isFeatured !== undefined ? { isFeatured } : {}),
      ...(isNew !== undefined ? { isNew } : {}),
      ...(isDiscounted !== undefined ? { isDiscounted } : {}),
    } as Prisma.ProductWhereInput;

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: PRODUCT_INCLUDE,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items.map((p) => this.format(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ProductResponseDTO> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.format(product);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    await this.findById(id);

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.model !== undefined ? { model: dto.model } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
        ...(dto.images !== undefined ? { images: dto.images } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
        ...(dto.watchType !== undefined ? { watchType: dto.watchType } : {}),
        ...(dto.caseMaterial !== undefined ? { caseMaterial: dto.caseMaterial } : {}),
        ...(dto.caseDiameter !== undefined ? { caseDiameter: dto.caseDiameter } : {}),
        ...(dto.crystalMaterial !== undefined ? { crystalMaterial: dto.crystalMaterial } : {}),
        ...(dto.strapMaterial !== undefined ? { strapMaterial: dto.strapMaterial } : {}),
        ...(dto.movement !== undefined ? { movement: dto.movement } : {}),
        ...(dto.useCase !== undefined ? { useCase: dto.useCase } : {}),
        ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
        ...(dto.isNew !== undefined ? { isNew: dto.isNew } : {}),
        ...(dto.isBestSeller !== undefined ? { isBestSeller: dto.isBestSeller } : {}),
        ...(dto.isTopRated !== undefined ? { isTopRated: dto.isTopRated } : {}),
        ...(dto.isDiscounted !== undefined ? { isDiscounted: dto.isDiscounted } : {}),
        ...(dto.discountPercentage !== undefined
          ? { discountPercentage: dto.discountPercentage }
          : {}),
        ...(dto.brandId !== undefined ? { brand: { connect: { id: dto.brandId } } } : {}),
        ...(dto.categoryIds !== undefined
          ? { categories: { set: dto.categoryIds.map((i) => ({ id: i })) } }
          : {}),
        ...(dto.featureIds !== undefined
          ? { features: { set: dto.featureIds.map((i) => ({ id: i })) } }
          : {}),
        ...(dto.specificationIds !== undefined
          ? { specifications: { set: dto.specificationIds.map((i) => ({ id: i })) } }
          : {}),
        ...(dto.factoryIds !== undefined
          ? { factories: { set: dto.factoryIds.map((i) => ({ id: i })) } }
          : {}),
        ...(dto.supplierIds !== undefined
          ? { suppliers: { set: dto.supplierIds.map((i) => ({ id: i })) } }
          : {}),
      },
      include: PRODUCT_INCLUDE,
    });

    return this.format(updated);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.product.delete({ where: { id } });
  }

  private format(product: any): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      model: product.model,
      status: product.status,
      description: product.description ?? undefined,
      price: Number(product.price),
      stock: product.stock,
      images: product.images,
      tags: product.tags,
      watchType: product.watchType,
      caseMaterial: product.caseMaterial,
      caseDiameter: product.caseDiameter,
      crystalMaterial: product.crystalMaterial,
      strapMaterial: product.strapMaterial,
      movement: product.movement,
      useCase: product.useCase,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      isBestSeller: product.isBestSeller,
      isTopRated: product.isTopRated,
      isDiscounted: product.isDiscounted,
      discountPercentage: product.discountPercentage ?? undefined,
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        description: product.brand.description ?? undefined,
      },
      categories: product.categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? undefined,
      })),
      features: product.features.map((f: any) => ({
        id: f.id,
        name: f.name,
        description: f.description ?? undefined,
      })),
      specifications: product.specifications.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? undefined,
      })),
      factories: product.factories.map((f: any) => ({
        id: f.id,
        name: f.name,
        description: f.description ?? undefined,
      })),
      suppliers: product.suppliers.map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? undefined,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
