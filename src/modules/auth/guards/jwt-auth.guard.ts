/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/shared/constants/routes';
import { UsersService } from '../../users/users.service';
import { TokenService } from '../services/token.service';

interface FastifyRequestWithUser {
  user?: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
  headers: {
    authorization?: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controllerClass = context.getClass();
    const isPublic =
      this.reflector.get<boolean>(IS_PUBLIC_KEY, handler) ??
      this.reflector.get<boolean>(IS_PUBLIC_KEY, controllerClass);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token de acesso não fornecido');
    }

    const token = this.tokenService.extractTokenFromHeader(authorization);
    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Tipo de token inválido');
      }

      const user = await this.usersService.findByIdWithRoles(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (!user.isVerified) {
        throw new UnauthorizedException('Usuário não verificado');
      }

      const roles = (user.roles || []).map((role) => role.name);
      const permissions = (user.roles || []).flatMap((role) =>
        (role.permissions || []).map((permission) => `${permission.resource}:${permission.action}`),
      );

      // Adicionar informações do usuário à request
      request.user = {
        id: user.id,
        email: user.email,
        roles,
        permissions,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
