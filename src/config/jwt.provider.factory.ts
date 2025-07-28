import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
