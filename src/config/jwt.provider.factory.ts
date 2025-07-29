import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const ACCESS_JWT_SERVICE = 'ACCESS_JWT_SERICE';
export const REFRESH_JWT_SERVICE = 'REFRESH_JWT_SERICE';

export function createJwtProvider(
  provideName: string,
  secretKeyName: string,
  expiresInKeyName: string,
) {
  return {
    provide: provideName,
    useFactory: (configService: ConfigService) => {
      return new JwtService({
        secret: configService.get<string>(secretKeyName),
        signOptions: {
          expiresIn: configService.get<string>(expiresInKeyName),
        },
      });
    },
    inject: [ConfigService],
  };
}
