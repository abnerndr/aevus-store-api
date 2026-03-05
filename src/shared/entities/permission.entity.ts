export class Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
  roles?: Role[];
}

import { Role } from './role.entity';
