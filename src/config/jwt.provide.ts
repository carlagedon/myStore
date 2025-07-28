import { JwtService } from '@nestjs/jwt';

export const ACCESS_JWT_SERVICE = 'ACCESS_JWT_SERVICE';
export const REFRESH_JWT_SERVICE = 'REFRESH_JWT_SERVICE';

export function createJwtProvider() {
  return {
    provide: ACCESS_JWT_SERVICE,
    useFactory: () =>
      new JwtService({ secret: 'test', signOptions: { expiresIn: '1h' } }),
  };
}
