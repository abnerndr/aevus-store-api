import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface FastifyRequestWithUser {
  user?: CurrentUserData;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest<FastifyRequestWithUser>();
    return request.user as CurrentUserData;
  },
);
