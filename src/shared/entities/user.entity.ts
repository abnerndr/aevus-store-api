import { Role } from './role.entity';

export class User {
  id: string;
  code: string;
  email: string;
  password: string | null;
  name: string | null;
  avatar: string | null;
  isVerified: boolean;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  magicLinkToken: string | null;
  magicLinkExpires: Date | null;
  refreshToken: string | null;
  roles?: Role[];
  createdAt: Date;
  updatedAt: Date;
}
