import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY } from 'src/shared/constants/casl';
import { Permission } from '../../../shared/entities/permission.entity';
import { Role } from '../../../shared/entities/role.entity';
import { User } from '../../../shared/entities/user.entity';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { RequiredRule } from '../decorators/check-abilities.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

    if (rules.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const ability = this.caslAbilityFactory.createForUser(user);

    for (const rule of rules) {
      const subject = this.getSubjectClass(rule.subject);

      const isAllowed = (ability as any).can(rule.action, subject);

      if (!isAllowed) {
        const hasManage = (ability as any).can('manage', subject);
        const hasManageAll = (ability as any).can('manage', 'all');

        if (!hasManage && !hasManageAll) {
          throw new ForbiddenException(
            `Insufficient permissions. Required: ${rule.action} on ${rule.subject}`,
          );
        }
      }
    }

    return true;
  }

  private getSubjectClass(subject: string): any {
    switch (subject) {
      case 'User':
        return User;
      case 'Role':
        return Role;
      case 'Permission':
        return Permission;
      default:
        return subject;
    }
  }
}
