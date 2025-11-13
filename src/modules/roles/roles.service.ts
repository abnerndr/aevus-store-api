import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission, Role } from '../../shared/entities';
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
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDTO): Promise<RoleResponseDTO> {
    const { name, description, permissionIds } = createRoleDto;

    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });
    if (existingRole) {
      throw new ConflictException('Role already exists');
    }

    const role = this.rolesRepository.create({ name, description });

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionsRepository.find({
        where: { id: In(permissionIds) },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found');
      }
      role.permissions = permissions;
    }

    const savedRole = await this.rolesRepository.save(role);
    return this.formatRoleResponse(savedRole);
  }

  async findAllRoles(): Promise<RoleListResponseDTO> {
    const [roles, total] = await this.rolesRepository.findAndCount({
      relations: ['permissions'],
      order: { name: 'ASC' },
    });

    return {
      roles: roles.map((role) => this.formatRoleResponse(role)),
      total,
    };
  }

  async createPermission(createPermissionDto: CreatePermissionDTO): Promise<PermissionResponseDTO> {
    const { name, resource, action, description } = createPermissionDto;

    const existingPermission = await this.permissionsRepository.findOne({
      where: { name },
    });
    if (existingPermission) {
      throw new ConflictException('Permission already exists');
    }

    const permission = this.permissionsRepository.create({
      name,
      resource,
      action,
      description,
    });

    const savedPermission = await this.permissionsRepository.save(permission);
    return this.formatPermissionResponse(savedPermission);
  }

  async findAllPermissions(): Promise<PermissionListResponseDTO> {
    const [permissions, total] = await this.permissionsRepository.findAndCount({
      order: { resource: 'ASC', action: 'ASC' },
    });

    return {
      permissions: permissions.map((permission) => this.formatPermissionResponse(permission)),
      total,
    };
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RoleResponseDTO> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.permissionsRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const hasPermission = role.permissions.some((p) => p.id === permissionId);
    if (hasPermission) {
      throw new ConflictException('Permission already assigned to role');
    }

    role.permissions.push(permission);
    const savedRole = await this.rolesRepository.save(role);
    return this.formatRoleResponse(savedRole);
  }

  async findRoleById(id: string): Promise<RoleResponseDTO> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.formatRoleResponse(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDTO): Promise<RoleResponseDTO> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const { name, description, permissionIds } = updateRoleDto;

    if (name && name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name },
      });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
      role.name = name;
    }

    if (description !== undefined) {
      role.description = description;
    }

    if (permissionIds) {
      const permissions = await this.permissionsRepository.find({
        where: { id: In(permissionIds) },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permissions not found');
      }
      role.permissions = permissions;
    }

    const savedRole = await this.rolesRepository.save(role);
    return this.formatRoleResponse(savedRole);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.rolesRepository.remove(role);
  }

  async findPermissionById(id: string): Promise<PermissionResponseDTO> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return this.formatPermissionResponse(permission);
  }

  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDTO,
  ): Promise<PermissionResponseDTO> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const { name, resource, action, description } = updatePermissionDto;

    if (name && name !== permission.name) {
      const existingPermission = await this.permissionsRepository.findOne({
        where: { name },
      });
      if (existingPermission) {
        throw new ConflictException('Permission name already exists');
      }
      permission.name = name;
    }

    if (resource !== undefined) permission.resource = resource;
    if (action !== undefined) permission.action = action;
    if (description !== undefined) permission.description = description;

    const savedPermission = await this.permissionsRepository.save(permission);
    return this.formatPermissionResponse(savedPermission);
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionsRepository.remove(permission);
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<RoleResponseDTO> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.permissionsRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    role.permissions = role.permissions.filter((p) => p.id !== permissionId);
    const savedRole = await this.rolesRepository.save(role);
    return this.formatRoleResponse(savedRole);
  }

  private formatRoleResponse(role: Role): RoleResponseDTO {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
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
      description: permission.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
