import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { User } from 'src/shared/entities';
import { UsersService } from '../../users/users.service';

interface FastifyRequestWithQuery {
  query: {
    token?: string;
  };
}

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy, 'magic-link') {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(req: FastifyRequestWithQuery): Promise<User> {
    const token = req.query.token;

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

    await this.usersService.updateMagicLinkToken(user.id, undefined, undefined);

    return user;
  }
}
