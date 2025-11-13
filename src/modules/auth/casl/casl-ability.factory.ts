import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from 'src/shared/enums/casl-action.enum';
import { Permission } from '../../../shared/entities/permission.entity';
import { Role } from '../../../shared/entities/role.entity';
import { User } from '../../../shared/entities/user.entity';

type Subjects = InferSubjects<typeof User | typeof Role | typeof Permission> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (!user) {
      throw new Error('User is required to create abilities');
    }

    if (!user.roles || !Array.isArray(user.roles)) {
      can(Action.READ, User, { id: user.id });
      can(Action.UPDATE, User, { id: user.id });

      return build({
        detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    if (user.roles.some((role) => role.name === 'admin')) {
      can(Action.MANAGE, 'all');
      return build({
        detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role) => {
        if (typeof role === 'string') {
          if (role === 'admin') {
            can(Action.MANAGE, 'all');
          }
          return;
        }

        if (role?.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach((permission) => {
            let action = permission.action as Action;
            const resource = permission.resource;

            if (action === ('all' as any)) {
              action = Action.MANAGE;
            }

            if (resource === 'all') {
              can(action, 'all');
            } else {
              const subject = this.getSubjectClass(resource);
              if (subject) {
                can(action, subject);
              }
            }
          });
        }
      });
    }

    can(Action.READ, User, { id: user.id });
    can(Action.UPDATE, User, { id: user.id });

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private getSubjectClass(resource: string): any {
    switch (resource) {
      case 'user':
        return User;
      case 'role':
        return Role;
      case 'permission':
        return Permission;
      default:
        return resource;
    }
  }
}
