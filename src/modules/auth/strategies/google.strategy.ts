import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { CONFIG } from 'src/shared/constants/env';

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

  async validate(profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, id } = profile;

    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      avatar: photos[0].value,
      googleId: id,
    };

    done(null, user);
  }
}
