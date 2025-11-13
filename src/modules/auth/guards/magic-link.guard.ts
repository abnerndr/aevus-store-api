import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class MagicLinkGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token as string;

    if (!token) {
      throw new UnauthorizedException('Magic link token is required');
    }

    const user = await this.usersService.findByMagicLinkToken(token);

    if (!user) {
      throw new UnauthorizedException('Invalid magic link token');
    }

    if (!user.magicLinkExpires || user.magicLinkExpires < new Date()) {
      throw new UnauthorizedException('Magic link has expired');
    }

    request.user = user;

    return true;
  }
}
