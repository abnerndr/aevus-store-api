import { Permission } from './permission.entity';

export class Role {
  id: string;
  name: string;
  description: string | null;
  users?: User[];
  permissions?: Permission[];
}

import { User } from './user.entity';
