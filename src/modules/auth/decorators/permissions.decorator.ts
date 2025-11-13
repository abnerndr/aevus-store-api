import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from 'src/shared/constants/permission';

export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
