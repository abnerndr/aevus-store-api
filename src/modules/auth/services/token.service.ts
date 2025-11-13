import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CONFIG } from 'src/shared/constants/env';
import { JwtPayload, TokenPair } from 'src/shared/interfaces/jwt-token';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  public async generateTokenPair(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[],
  ): Promise<TokenPair> {
    const accessPayload = this.getAccessPayload(userId, email, roles, permissions);
    const refreshPayload = this.getRefreshPayload(userId, email, roles, permissions);

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: CONFIG.JWT.SECRET,
      expiresIn: CONFIG.JWT.EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: CONFIG.JWT.REFRESH_SECRET,
      expiresIn: CONFIG.JWT.REFRESH_EXPIRES_IN,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: CONFIG.JWT.EXPIRES_IN,
      refresh_expires_in: CONFIG.JWT.REFRESH_EXPIRES_IN,
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: CONFIG.JWT.SECRET,
    });
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, {
      secret: CONFIG.JWT.REFRESH_SECRET,
    });
  }

  extractTokenFromHeader(authorization: string): string | null {
    if (!authorization) return null;

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : null;
  }

  private getAccessPayload(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[],
  ): JwtPayload {
    return {
      sub: userId,
      email,
      roles,
      permissions,
      type: 'access',
    } as JwtPayload;
  }

  private getRefreshPayload(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[],
  ): JwtPayload {
    return {
      sub: userId,
      email,
      roles,
      permissions,
      type: 'refresh',
    } as JwtPayload;
  }
}
