import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { QueryCustomerDTO } from './dto/query-customer.dto';
import { CustomerListResponseDTO, CustomerResponseDTO } from './dto/response-customer.dto';
import { UpdateCustomerDTO } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDTO): Promise<CustomerResponseDTO> {
    await this.ensureUnique(dto.email, dto.cpf);

    const customer = await this.prisma.customer.create({
      data: this.toCreateData(dto),
      include: { _count: { select: { orders: true } } },
    });

    return this.format(customer);
  }

  async findAll(query: QueryCustomerDTO): Promise<CustomerListResponseDTO> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: Prisma.CustomerWhereInput = search
      ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { cpf: { contains: search.replace(/\D/g, '') } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        include: { _count: { select: { orders: true } } },
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: items.map((item) => this.format(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<CustomerResponseDTO> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return this.format(customer);
  }

  async update(id: string, dto: UpdateCustomerDTO): Promise<CustomerResponseDTO> {
    await this.findById(id);

    if (dto.email || dto.cpf) {
      await this.ensureUnique(dto.email, dto.cpf, id);
    }

    const current = await this.prisma.customer.findUniqueOrThrow({ where: { id } });
    const merged = {
      fullName: dto.fullName ?? current.fullName,
      email: dto.email ?? current.email,
      phone: dto.phone ?? current.phone,
      cpf: dto.cpf ?? current.cpf,
      postalCode: dto.postalCode ?? current.postalCode,
      street: dto.street ?? current.street,
      neighborhood: dto.neighborhood ?? current.neighborhood,
      number: dto.number ?? current.number,
      complement: dto.complement ?? current.complement ?? undefined,
      city: dto.city ?? current.city,
      state: dto.state ?? current.state,
      fullAddress: dto.fullAddress ?? current.fullAddress,
    };

    const updated = await this.prisma.customer.update({
      where: { id },
      data: this.toUpdateData(merged),
      include: { _count: { select: { orders: true } } },
    });

    return this.format(updated);
  }

  async delete(id: string): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (customer._count.orders > 0) {
      throw new ConflictException('Não é possível excluir um cliente com pedidos vinculados.');
    }

    await this.prisma.customer.delete({ where: { id } });
  }

  private async ensureUnique(email?: string, cpf?: string, ignoreId?: string): Promise<void> {
    if (!email && !cpf) return;

    const conditions: Prisma.CustomerWhereInput[] = [];
    if (email) conditions.push({ email: email.toLowerCase() });
    if (cpf) conditions.push({ cpf: cpf.replace(/\D/g, '') });

    const existing = await this.prisma.customer.findFirst({
      where: {
        OR: conditions,
        ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
      },
    });

    if (!existing) return;

    if (email && existing.email === email.toLowerCase()) {
      throw new ConflictException('Já existe um cliente com este e-mail.');
    }

    throw new ConflictException('Já existe um cliente com este CPF.');
  }

  private toCreateData(dto: CreateCustomerDTO): Prisma.CustomerCreateInput {
    return {
      id: uuidv7(),
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      cpf: dto.cpf.replace(/\D/g, ''),
      postalCode: dto.postalCode.replace(/\D/g, ''),
      street: dto.street,
      neighborhood: dto.neighborhood,
      number: dto.number,
      complement: dto.complement ?? null,
      city: dto.city,
      state: dto.state.toUpperCase(),
      fullAddress:
        dto.fullAddress?.trim() ||
        this.buildFullAddress({
          street: dto.street,
          number: dto.number,
          neighborhood: dto.neighborhood,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          complement: dto.complement,
        }),
    };
  }

  private toUpdateData(dto: {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    postalCode: string;
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    fullAddress?: string;
  }): Prisma.CustomerUpdateInput {
    return {
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      cpf: dto.cpf.replace(/\D/g, ''),
      postalCode: dto.postalCode.replace(/\D/g, ''),
      street: dto.street,
      neighborhood: dto.neighborhood,
      number: dto.number,
      complement: dto.complement ?? null,
      city: dto.city,
      state: dto.state.toUpperCase(),
      fullAddress:
        dto.fullAddress?.trim() ||
        this.buildFullAddress({
          street: dto.street,
          number: dto.number,
          neighborhood: dto.neighborhood,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          complement: dto.complement,
        }),
    };
  }

  private buildFullAddress(address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    complement?: string | null;
  }): string {
    return [
      `${address.street}, ${address.number}`,
      address.complement || null,
      address.neighborhood,
      `${address.city} - ${address.state.toUpperCase()}`,
      `CEP ${address.postalCode.replace(/\D/g, '')}`,
    ]
      .filter(Boolean)
      .join(', ');
  }

  private format(
    customer: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      cpf: string;
      postalCode: string;
      street: string;
      neighborhood: string;
      number: string;
      complement: string | null;
      city: string;
      state: string;
      fullAddress: string;
      createdAt: Date;
      updatedAt: Date;
      _count: { orders: number };
    },
  ): CustomerResponseDTO {
    return {
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      cpf: customer.cpf,
      postalCode: customer.postalCode,
      street: customer.street,
      neighborhood: customer.neighborhood,
      number: customer.number,
      complement: customer.complement ?? undefined,
      city: customer.city,
      state: customer.state,
      fullAddress: customer.fullAddress,
      ordersCount: customer._count.orders,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }
}
