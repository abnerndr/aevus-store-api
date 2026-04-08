import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateProductDTO,
  CreateProductInstallmentOptionDTO,
  CreateProductOptionalItemDTO,
  CreateProductReviewDTO,
} from './dto/create-product.dto';
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
  optionalItems: {
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
  installmentOptions: {
    orderBy: {
      sortOrder: 'asc' as const,
    },
  },
  reviews: {
    orderBy: {
      createdAt: 'desc' as const,
    },
  },
} as const;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof PRODUCT_INCLUDE }>;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const reviewSummary = this.getReviewSummary(dto.reviews);

    const product = await this.prisma.product.create({
      data: {
        id: uuidv7(),
        name: dto.name,
        model: dto.model,
        status: dto.status,
        description: dto.description ?? null,
        price: dto.price,
        cashPrice: dto.cashPrice ?? null,
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
        purchaseNotes: dto.purchaseNotes ?? null,
        averageRating: reviewSummary.averageRating,
        reviewCount: reviewSummary.reviewCount,
        infinitePayId: dto.infinitePayId ?? null,
        infinitePayHandle: dto.infinitePayHandle ?? null,
        infinitePayDescription: dto.infinitePayDescription ?? null,
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
        ...(dto.optionalItems?.length
          ? {
              optionalItems: {
                create: this.mapOptionalItems(dto.optionalItems),
              },
            }
          : {}),
        ...(dto.installmentOptions?.length
          ? {
              installmentOptions: {
                create: this.mapInstallmentOptions(dto.installmentOptions),
              },
            }
          : {}),
        ...(dto.reviews?.length
          ? {
              reviews: {
                create: this.mapReviews(dto.reviews),
              },
            }
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

    const reviewSummary =
      dto.reviews !== undefined ? this.getReviewSummary(dto.reviews) : undefined;

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.model !== undefined ? { model: dto.model } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.cashPrice !== undefined ? { cashPrice: dto.cashPrice } : {}),
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
        ...(dto.purchaseNotes !== undefined ? { purchaseNotes: dto.purchaseNotes } : {}),
        ...(dto.infinitePayId !== undefined ? { infinitePayId: dto.infinitePayId } : {}),
        ...(dto.infinitePayHandle !== undefined
          ? { infinitePayHandle: dto.infinitePayHandle }
          : {}),
        ...(dto.infinitePayDescription !== undefined
          ? { infinitePayDescription: dto.infinitePayDescription }
          : {}),
        ...(reviewSummary
          ? {
              averageRating: reviewSummary.averageRating,
              reviewCount: reviewSummary.reviewCount,
            }
          : {}),
        ...(dto.brandId !== undefined ? { brand: { connect: { id: dto.brandId } } } : {}),
        ...(dto.categoryIds !== undefined
          ? { categories: { set: dto.categoryIds.map((itemId) => ({ id: itemId })) } }
          : {}),
        ...(dto.featureIds !== undefined
          ? { features: { set: dto.featureIds.map((itemId) => ({ id: itemId })) } }
          : {}),
        ...(dto.specificationIds !== undefined
          ? { specifications: { set: dto.specificationIds.map((itemId) => ({ id: itemId })) } }
          : {}),
        ...(dto.factoryIds !== undefined
          ? { factories: { set: dto.factoryIds.map((itemId) => ({ id: itemId })) } }
          : {}),
        ...(dto.supplierIds !== undefined
          ? { suppliers: { set: dto.supplierIds.map((itemId) => ({ id: itemId })) } }
          : {}),
        ...(dto.optionalItems !== undefined
          ? {
              optionalItems: {
                deleteMany: {},
                create: this.mapOptionalItems(dto.optionalItems),
              },
            }
          : {}),
        ...(dto.installmentOptions !== undefined
          ? {
              installmentOptions: {
                deleteMany: {},
                create: this.mapInstallmentOptions(dto.installmentOptions),
              },
            }
          : {}),
        ...(dto.reviews !== undefined
          ? {
              reviews: {
                deleteMany: {},
                create: this.mapReviews(dto.reviews),
              },
            }
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

  private mapOptionalItems(items: CreateProductOptionalItemDTO[]) {
    return items.map((item, index) => ({
      id: uuidv7(),
      title: item.title,
      description: item.description ?? null,
      price: item.price,
      oldPrice: item.oldPrice ?? null,
      image: item.image ?? null,
      sortOrder: index,
    }));
  }

  private mapInstallmentOptions(items: CreateProductInstallmentOptionDTO[]) {
    return items.map((item, index) => ({
      id: uuidv7(),
      label: item.label ?? null,
      installments: item.installments,
      installmentAmount: item.installmentAmount,
      totalAmount: item.totalAmount,
      feePercentage: item.feePercentage ?? null,
      sortOrder: index,
    }));
  }

  private mapReviews(items: CreateProductReviewDTO[]) {
    return items.map((item) => ({
      id: uuidv7(),
      authorName: item.authorName,
      rating: item.rating,
      title: item.title ?? null,
      comment: item.comment ?? null,
    }));
  }

  private getReviewSummary(reviews?: CreateProductReviewDTO[]) {
    const items = reviews ?? [];
    if (items.length === 0) {
      return {
        averageRating: null,
        reviewCount: 0,
      };
    }

    const total = items.reduce((sum, review) => sum + review.rating, 0);
    return {
      averageRating: Number((total / items.length).toFixed(2)),
      reviewCount: items.length,
    };
  }

  private format(product: ProductWithRelations): ProductResponseDTO {
    return {
      id: product.id,
      name: product.name,
      model: product.model,
      status: product.status,
      description: product.description ?? undefined,
      price: Number(product.price),
      cashPrice: product.cashPrice ? Number(product.cashPrice) : undefined,
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
      purchaseNotes: product.purchaseNotes ?? undefined,
      averageRating: product.averageRating ? Number(product.averageRating) : undefined,
      reviewCount: product.reviewCount,
      infinitePayId: product.infinitePayId ?? undefined,
      infinitePayHandle: product.infinitePayHandle ?? undefined,
      infinitePayDescription: product.infinitePayDescription ?? undefined,
      optionalItems: product.optionalItems.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? undefined,
        price: Number(item.price),
        oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
        image: item.image ?? undefined,
      })),
      installmentOptions: product.installmentOptions.map((item) => ({
        id: item.id,
        label: item.label ?? undefined,
        installments: item.installments,
        installmentAmount: Number(item.installmentAmount),
        totalAmount: Number(item.totalAmount),
        feePercentage: item.feePercentage ? Number(item.feePercentage) : undefined,
      })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        authorName: review.authorName,
        rating: review.rating,
        title: review.title ?? undefined,
        comment: review.comment ?? undefined,
        createdAt: review.createdAt,
      })),
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        description: product.brand.description ?? undefined,
      },
      categories: product.categories.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description ?? undefined,
      })),
      features: product.features.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description ?? undefined,
      })),
      specifications: product.specifications.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? undefined,
      })),
      factories: product.factories.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description ?? undefined,
      })),
      suppliers: product.suppliers.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description ?? undefined,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
