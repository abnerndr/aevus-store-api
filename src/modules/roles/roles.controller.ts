import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreatePermissions,
  CreateRoles,
  ReadPermissions,
  ReadRoles,
} from '../auth/decorators/check-abilities.decorator';
import { AbilitiesGuard } from '../auth/guards/abilities.guard';
import { CreatePermissionDTO } from './dto/permission/create-permission.dto';
import {
  PermissionListResponseDTO,
  PermissionResponseDTO,
} from './dto/permission/response-permission.dto';
import { CreateRoleDTO } from './dto/role/create-role.dto';
import { RoleListResponseDTO, RoleResponseDTO } from './dto/role/response-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles & Permissions')
@ApiBearerAuth()
@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @CreateRoles()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Criar nova role' })
  @ApiBody({ type: CreateRoleDTO })
  @ApiResponse({
    status: 201,
    description: 'Role criada com sucesso',
    type: RoleResponseDTO,
  })
  async createRole(@Body() createRoleDto: CreateRoleDTO): Promise<RoleResponseDTO> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ReadRoles()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar todas as roles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles retornada com sucesso',
    type: RoleListResponseDTO,
  })
  async findAllRoles(): Promise<RoleListResponseDTO> {
    return this.rolesService.findAllRoles();
  }

  @Post('permissions')
  @CreatePermissions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Criar nova permissão' })
  @ApiBody({ type: CreatePermissionDTO })
  @ApiResponse({
    status: 201,
    description: 'Permissão criada com sucesso',
    type: PermissionResponseDTO,
  })
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDTO,
  ): Promise<PermissionResponseDTO> {
    return this.rolesService.createPermission(createPermissionDto);
  }

  @Get('permissions')
  @ReadPermissions()
  @UseGuards(AbilitiesGuard)
  @ApiOperation({ summary: 'Listar todas as permissões' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permissões retornada com sucesso',
    type: PermissionListResponseDTO,
  })
  async findAllPermissions(): Promise<PermissionListResponseDTO> {
    return this.rolesService.findAllPermissions();
  }
}
