import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';
import { CONFIG } from 'src/shared/constants/env';
import { Action, Resource } from 'src/shared/enums/casl-action.enum';

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

export async function seedRolesAndPermissions(prisma: PrismaClient) {
  const savedPermissions: { id: string; name: string; resource: string; action: string }[] = [];

  for (const permData of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: {
        id: uuidv7(),
        name: permData.name,
        resource: String(permData.resource),
        action: String(permData.action),
        description: permData.description,
      },
    });
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

  const savedRoles: { id: string; name: string }[] = [];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        permissions: {
          set: roleData.permissions.map((p) => ({ id: p.id })),
        },
      },
      create: {
        id: uuidv7(),
        name: roleData.name,
        description: roleData.description,
        permissions: {
          connect: roleData.permissions.map((p) => ({ id: p.id })),
        },
      },
    });
    savedRoles.push(role);
  }

  const adminRole = savedRoles.find((r) => r.name === 'admin');

  const hashedPassword = await bcrypt.hash(CONFIG.ADMIN.PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: CONFIG.ADMIN.EMAIL },
    update: {},
    create: {
      id: uuidv7(),
      code: (await import('@paralleldrive/cuid2')).createId(),
      email: CONFIG.ADMIN.EMAIL,
      password: hashedPassword,
      name: 'Admin',
      isVerified: true,
      roles: {
        connect: [{ id: adminRole!.id }],
      },
    },
  });

  console.log('✅ Roles and permissions seeded successfully!');
  console.log(`📊 Created ${savedPermissions.length} permissions`);
  console.log(`👥 Created ${savedRoles.length} roles`);
  console.log(`👤 Admin user: ${CONFIG.ADMIN.EMAIL} / ${CONFIG.ADMIN.PASSWORD}`);
}
