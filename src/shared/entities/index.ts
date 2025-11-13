import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Permission } from './permission.entity';
import { Role } from './role.entity';
import { User } from './user.entity';

export const entities: EntityClassOrSchema[] = [Permission, Role, User];
export { Permission, Role, User };
