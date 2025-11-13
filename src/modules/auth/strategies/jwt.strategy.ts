import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CONFIG } from 'src/shared/constants/env';
import { JwtPayload } from 'src/shared/interfaces/jwt-token';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: CONFIG.JWT.SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findByIdWithRoles(payload.sub);

    if (!user) {
      console.error('JWT Strategy: User not found for id:', payload.sub);
      throw new Error('User not found');
    }

    console.log('JWT Strategy: User loaded with roles:', {
      id: user.id,
      email: user.email,
      rolesCount: user.roles?.length || 0,
      hasRoles: !!user.roles,
      roles: user.roles?.map((role) => ({
        id: role?.id,
        name: role?.name,
        permissionsCount: role?.permissions?.length || 0,
      })),
    });

    return user;
  }
}
