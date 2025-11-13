import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { CONFIG } from 'src/shared/constants/env';
import { OAuthUserInfo } from 'src/shared/interfaces/oauth.token';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: CONFIG.GOOGLE_OAUTH.CLIENT_ID,
      clientSecret: CONFIG.GOOGLE_OAUTH.CLIENT_SECRET,
      callbackURL: CONFIG.GOOGLE_OAUTH.CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(profile: OAuthUserInfo): Promise<OAuthUserInfo> {
    const googleUser = await this.googleAuthService.verifyIdToken(profile.id);
    if (!googleUser.email_verified) {
      throw new UnauthorizedException('Email Google não verificado');
    }
    return googleUser;
  }
}
