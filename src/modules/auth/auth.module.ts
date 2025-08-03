import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import {
  ACCESS_JWT_SERVICE,
  createJwtProvider,
  REFRESH_JWT_SERVICE,
} from 'src/config/jwt.provider.factory';
import { PrismaModule } from 'src/config/db/prisma.module';
import { AuthService } from './auth.service';
import { AccessJwtStrategy } from './access.jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessJwtStrategy,
    createJwtProvider(
      ACCESS_JWT_SERVICE,
      'JWT_ACCESS_SECRET',
      'JWT_ACCESS_EXPIRATION_TIME',
    ),
    createJwtProvider(
      REFRESH_JWT_SERVICE,
      'JWT_REFRESH_SECRET',
      'JWT_REFRESH_EXPIRATION_TIME',
    ),
  ],
  imports: [UserModule, ConfigModule, PrismaModule],
})
export class AuthModule {}
