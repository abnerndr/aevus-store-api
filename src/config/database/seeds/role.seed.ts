import * as bcrypt from 'bcryptjs';
import { CONFIG } from 'src/shared/constants/env';
import { Permission, Role, User } from 'src/shared/entities';
import { Action, Resource } from 'src/shared/enums/casl-action.enum';
import { DataSource } from 'typeorm';

export async function seedRolesAndPermissions(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const userRepository = dataSource.getRepository(User);

  const permissions = [
    {
      name: 'users:create',
      resource: Resource.USER,
      action: Action.CREATE,
      description: 'Create new users',
    },
    {
      name: 'users:read',
      resource: Resource.USER,
      action: Action.READ,
      description: 'View users',
    },
    {
      name: 'users:update',
      resource: Resource.USER,
      action: Action.UPDATE,
      description: 'Update users',
    },
    {
      name: 'users:delete',
      resource: Resource.USER,
      action: Action.DELETE,
      description: 'Delete users',
    },
    {
      name: 'users:manage',
      resource: Resource.USER,
      action: Action.MANAGE,
      description: 'Full access to users',
    },
    {
      name: 'roles:create',
      resource: Resource.ROLE,
      action: Action.CREATE,
      description: 'Create roles',
    },
    {
      name: 'roles:read',
      resource: Resource.ROLE,
      action: Action.READ,
      description: 'View roles',
    },
    {
      name: 'roles:update',
      resource: Resource.ROLE,
      action: Action.UPDATE,
      description: 'Update roles',
    },
    {
      name: 'roles:delete',
      resource: Resource.ROLE,
      action: Action.DELETE,
      description: 'Delete roles',
    },
    {
      name: 'roles:manage',
      resource: Resource.ROLE,
      action: Action.MANAGE,
      description: 'Full access to roles',
    },
    {
      name: 'permissions:create',
      resource: Resource.PERMISSION,
      action: Action.CREATE,
      description: 'Create permissions',
    },
    {
      name: 'permissions:read',
      resource: Resource.PERMISSION,
      action: Action.READ,
      description: 'View permissions',
    },
    {
      name: 'permissions:update',
      resource: Resource.PERMISSION,
      action: Action.UPDATE,
      description: 'Update permissions',
    },
    {
      name: 'permissions:delete',
      resource: Resource.PERMISSION,
      action: Action.DELETE,
      description: 'Delete permissions',
    },
    {
      name: 'permissions:manage',
      resource: Resource.PERMISSION,
      action: Action.MANAGE,
      description: 'Full access to permissions',
    },
    {
      name: 'admin:all',
      resource: Resource.ALL,
      action: Action.MANAGE,
      description: 'Full system access',
    },
  ];

  const savedPermissions: Permission[] = [];
  for (const permData of permissions) {
    let permission = await permissionRepository.findOne({
      where: { name: permData.name },
    });

    if (!permission) {
      permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
    }

    savedPermissions.push(permission);
  }

  const roles = [
    {
      name: 'admin',
      description: 'System Administrator',
      permissions: savedPermissions,
    },
    {
      name: 'user',
      description: 'Regular User',
      permissions: savedPermissions.filter(
        (p) => p.resource === String(Resource.USER) && p.action === String(Action.READ),
      ),
    },
    {
      name: 'moderator',
      description: 'Content Moderator',
      permissions: savedPermissions.filter(
        (p) =>
          p.resource === String(Resource.USER) &&
          [String(Action.READ), String(Action.UPDATE)].includes(p.action),
      ),
    },
  ];

  const savedRoles: Role[] = [];
  for (const roleData of roles) {
    let role = await roleRepository.findOne({
      where: { name: roleData.name },
      relations: ['permissions'],
    });

    if (!role) {
      role = roleRepository.create({
        name: roleData.name,
        description: roleData.description,
      });
      role.permissions = roleData.permissions;
      await roleRepository.save(role);
    } else {
      role.permissions = roleData.permissions;
      await roleRepository.save(role);
    }

    savedRoles.push(role);
  }

  const adminRole = savedRoles.find((r) => r.name === 'admin');

  let adminUser = await userRepository.findOne({
    where: { email: CONFIG.ADMIN.EMAIL },
    relations: ['roles'],
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(CONFIG.ADMIN.PASSWORD, 10);
    adminUser = userRepository.create({
      email: CONFIG.ADMIN.EMAIL,
      password: hashedPassword,
      name: 'Admin',
      isVerified: true,
      roles: [adminRole!],
    });
    await userRepository.save(adminUser);
  }

  console.log('✅ Roles and permissions seeded successfully!');
  console.log(`📊 Created ${savedPermissions.length} permissions`);
  console.log(`👥 Created ${savedRoles.length} roles`);
  console.log(`👤 Admin user: ${CONFIG.ADMIN.EMAIL} / ${CONFIG.ADMIN.PASSWORD}`);
}
