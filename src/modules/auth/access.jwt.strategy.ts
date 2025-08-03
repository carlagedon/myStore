import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenContent } from 'src/types/access-token-content';
import { AccessTokenPayload } from 'src/types/access-token-payload';
import { Request } from 'express';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'access-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          const cookieName =
            configService.getOrThrow<string>('ACCESS_COOKIE_NAME');
          const token = req.cookies?.[cookieName] as string | null;
          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: AccessTokenPayload): AccessTokenContent {
    return {
      userId: payload.sub,
      userRole: payload.userRole,
    };
  }
}
