import { Module } from '@nestjs/common';
import { PrismaModule } from '../config/db/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessJwtGuard } from './auth/access.jwt.guard';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard,
    },
  ],
})
export class AppModule {}
