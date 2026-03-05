import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { Permission } from '../../shared/entities/permission.entity';
import { Role } from '../../shared/entities/role.entity';
import { CreatePermissionDTO } from './dto/permission/create-permission.dto';
import {
  PermissionListResponseDTO,
  PermissionResponseDTO,
} from './dto/permission/response-permission.dto';
import { UpdatePermissionDTO } from './dto/permission/update-permission.dto';
import { CreateRoleDTO } from './dto/role/create-role.dto';
import { RoleListResponseDTO, RoleResponseDTO } from './dto/role/response-role.dto';
import { UpdateRoleDTO } from './dto/role/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDTO): Promise<RoleResponseDTO> {
    const { name, description, permissionIds } = createRoleDto;

    const existingRole = await this.prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.prisma.permission.findMany({
        where: { id: { in: permissionIds } },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found');
      }
    }

    const role = await this.prisma.role.create({
      data: {
        id: uuidv7(),
        name,
        description: description ?? null,
        ...(permissionIds && permissionIds.length > 0
          ? { permissions: { connect: permissionIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { permissions: true },
    });

    return this.formatRoleResponse(role as unknown as Role);
  }

  async findAllRoles(): Promise<RoleListResponseDTO> {
    const roles = await this.prisma.role.findMany({
      include: { permissions: true },
      orderBy: { name: 'asc' },
    });

    return {
      roles: roles.map((role) => this.formatRoleResponse(role as unknown as Role)),
      total: roles.length,
    };
  }

  async createPermission(createPermissionDto: CreatePermissionDTO): Promise<PermissionResponseDTO> {
    const { name, resource, action, description } = createPermissionDto;

    const existingPermission = await this.prisma.permission.findUnique({ where: { name } });
    if (existingPermission) {
      throw new ConflictException('Permission already exists');
    }

    const permission = await this.prisma.permission.create({
      data: {
        id: uuidv7(),
        name,
        resource,
        action,
        description: description ?? null,
      },
    });

    return this.formatPermissionResponse(permission as unknown as Permission);
  }

  async findAllPermissions(): Promise<PermissionListResponseDTO> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });

    return {
      permissions: permissions.map((p) => this.formatPermissionResponse(p as unknown as Permission)),
      total: permissions.length,
    };
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RoleResponseDTO> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const hasPermission = role.permissions.some((p) => p.id === permissionId);
    if (hasPermission) {
      throw new ConflictException('Permission already assigned to role');
    }

    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: { permissions: { connect: { id: permissionId } } },
      include: { permissions: true },
    });

    return this.formatRoleResponse(updated as unknown as Role);
  }

  async findRoleById(id: string): Promise<RoleResponseDTO> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.formatRoleResponse(role as unknown as Role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDTO): Promise<RoleResponseDTO> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const { name, description, permissionIds } = updateRoleDto;

    if (name && name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({ where: { name } });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    if (permissionIds) {
      const permissions = await this.prisma.permission.findMany({
        where: { id: { in: permissionIds } },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found');
      }
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(permissionIds !== undefined
          ? { permissions: { set: permissionIds.map((pid) => ({ id: pid })) } }
          : {}),
      },
      include: { permissions: true },
    });

    return this.formatRoleResponse(updated as unknown as Role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.prisma.role.delete({ where: { id } });
  }

  async findPermissionById(id: string): Promise<PermissionResponseDTO> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return this.formatPermissionResponse(permission as unknown as Permission);
  }

  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDTO,
  ): Promise<PermissionResponseDTO> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const { name, resource, action, description } = updatePermissionDto;

    if (name && name !== permission.name) {
      const existingPermission = await this.prisma.permission.findUnique({ where: { name } });
      if (existingPermission) {
        throw new ConflictException('Permission name already exists');
      }
    }

    const updated = await this.prisma.permission.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(resource !== undefined ? { resource } : {}),
        ...(action !== undefined ? { action } : {}),
        ...(description !== undefined ? { description } : {}),
      },
    });

    return this.formatPermissionResponse(updated as unknown as Permission);
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.prisma.permission.findUnique({ where: { id } });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.prisma.permission.delete({ where: { id } });
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<RoleResponseDTO> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.prisma.permission.findUnique({ where: { id: permissionId } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: { permissions: { disconnect: { id: permissionId } } },
      include: { permissions: true },
    });

    return this.formatRoleResponse(updated as unknown as Role);
  }

  private formatRoleResponse(role: Role): RoleResponseDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: role.permissions
        ? role.permissions.map((p) => this.formatPermissionResponse(p))
        : [],
    };
  }

  private formatPermissionResponse(permission: Permission): PermissionResponseDTO {
    return {
      id: permission.id,
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description ?? '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
