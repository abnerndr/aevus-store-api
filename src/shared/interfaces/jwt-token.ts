export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
  type: 'access' | 'refresh';
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}
