import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { CONFIG } from 'src/shared/constants/env';
import { OAuthUserInfo } from 'src/shared/interfaces/oauth.token';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      CONFIG.GOOGLE_OAUTH.CLIENT_ID,
      CONFIG.GOOGLE_OAUTH.CLIENT_SECRET,
    );
  }

  public async verifyIdToken(idToken: string): Promise<OAuthUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: CONFIG.GOOGLE_OAUTH.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Token Google inválido');
      }

      return {
        id: payload.sub,
        email: payload.email!,
        name: payload.name!,
        avatar: payload.picture!,
        email_verified: payload.email_verified!,
      } as OAuthUserInfo;
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação Google', error);
    }
  }
}
