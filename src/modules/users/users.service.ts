import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../shared/entities/role.entity';
import { User } from '../../shared/entities/user.entity';
import { ChangePasswordDTO } from './dto/change-password.dto copy';
import { CreateUserDTO } from './dto/create-user.dto';
import { QueryUserDTO } from './dto/query-user.dto';
import { UserListResponseDTO, UserResponseDTO } from './dto/response-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

const USER_WITH_ROLES = {
  roles: {
    include: {
      permissions: true,
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: Partial<User>): Promise<User> {
    const { roles, ...rest } = userData;

    const created = await this.prisma.user.create({
      data: {
        id: uuidv7(),
        code: createId(),
        email: rest.email!,
        password: rest.password ?? null,
        name: rest.name ?? null,
        avatar: rest.avatar ?? null,
        isVerified: rest.isVerified ?? false,
        verificationToken: rest.verificationToken ?? null,
        resetPasswordToken: rest.resetPasswordToken ?? null,
        resetPasswordExpires: rest.resetPasswordExpires ?? null,
        magicLinkToken: rest.magicLinkToken ?? null,
        magicLinkExpires: rest.magicLinkExpires ?? null,
        refreshToken: rest.refreshToken ?? null,
        ...(roles && roles.length > 0
          ? { roles: { connect: roles.map((r) => ({ id: r.id })) } }
          : {}),
      },
      include: USER_WITH_ROLES,
    });

    return created as unknown as User;
  }

  async validUser(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: USER_WITH_ROLES,
    });
    return user as unknown as User | null;
  }

  async findByIdWithRoles(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: USER_WITH_ROLES,
    });
    return user as unknown as User | null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });
    return user as unknown as User | null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });
    return user as unknown as User | null;
  }

  async findByMagicLinkToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { magicLinkToken: token },
    });
    return user as unknown as User | null;
  }

  async findByRefreshToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { refreshToken: token },
      include: USER_WITH_ROLES,
    });
    return user as unknown as User | null;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const { roles, ...rest } = updateData;

    const data: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) {
        data[key] = value;
      } else {
        data[key] = null;
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        ...(roles !== undefined
          ? { roles: { set: roles.map((r: Role) => ({ id: r.id })) } }
          : {}),
      },
      include: USER_WITH_ROLES,
    });

    return updated as unknown as User;
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    let hashedPassword: string | undefined;
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const userData: Partial<User> = {
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      avatar: createUserDto.avatar,
    };

    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.findRolesByIds(createUserDto.roleIds);
      userData.roles = roles;
    }

    return this.create(userData);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO): Promise<User> {
    const existingUser = await this.findByIdWithRoles(id);
    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.findByEmail(updateUserDto.email);
      if (userWithEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    const updateData: Partial<User> = {
      email: updateUserDto.email,
      name: updateUserDto.name,
      avatar: updateUserDto.avatar,
      isVerified: updateUserDto.isVerified,
    };

    if (updateUserDto.roleIds) {
      const roles = await this.findRolesByIds(updateUserDto.roleIds);
      updateData.roles = roles;
    }

    return this.update(id, updateData);
  }

  async findAll(queryDto: QueryUserDTO): Promise<UserListResponseDTO> {
    const {
      page = 1,
      limit = 10,
      search,
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: Record<string, unknown> = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: { roles: true },
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users as unknown as UserResponseDTO[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.findByIdWithRoles(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.user.delete({ where: { id } });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDTO): Promise<void> {
    const user = await this.findById(userId);

    if (!user.password) {
      throw new BadRequestException('Usuário não possui senha definida');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hashedNewPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }

  async setPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async verifyUser(userId: string): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true, verificationToken: null },
      include: USER_WITH_ROLES,
    });
    return updated as unknown as User;
  }

  async getUserStats(): Promise<{
    total: number;
    verified: number;
    unverified: number;
  }> {
    const [total, verified, unverified] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isVerified: true } }),
      this.prisma.user.count({ where: { isVerified: false } }),
    ]);

    return { total, verified, unverified };
  }

  async updateMagicLinkToken(
    userId: string,
    magicLinkToken: string | undefined,
    magicLinkExpires: Date | undefined,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        magicLinkToken: magicLinkToken ?? null,
        magicLinkExpires: magicLinkExpires ?? null,
      },
    });
  }

  private async findRolesByIds(roleIds: string[]): Promise<Role[]> {
    if (!roleIds || roleIds.length === 0) {
      return [];
    }

    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
      include: { permissions: true },
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Uma ou mais roles não foram encontradas');
    }

    return roles as unknown as Role[];
  }
}
