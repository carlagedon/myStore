import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/config/db/prisma.service';
import {
  ACCESS_JWT_SERVICE,
  REFRESH_JWT_SERVICE,
} from 'src/config/jwt.provide';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidV4 } from 'uuid';

import { getTokenExpirationDate } from 'src/utils/getTokenExpirationDate';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    @Inject(ACCESS_JWT_SERVICE) private readonly jwtAccess: JwtService,
    @Inject(REFRESH_JWT_SERVICE) private readonly jwtRefresh: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = { sub: user.id, userRole: user.role };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken({ sub: payload.sub });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user;
        return rest;
      }
    }

    throw new HttpException('Неверный email или пароль', 401);
  }

  private async generateAccessToken(payload: {
    sub: number;
    userRole: string;
  }) {
    return await this.jwtAccess.signAsync(payload);
  }

  private async generateRefreshToken(payload: {
    sub: number;
    tokenFamily?: string;
  }): Promise<string> {
    if (!payload.tokenFamily) {
      payload.tokenFamily = uuidV4();
    }

    const refreshToken = await this.jwtRefresh.signAsync(payload);

    await this.saveRefreshToken({
      userId: payload.sub,
      refreshToken,
      family: payload.tokenFamily,
    });

    return refreshToken;
  }

  private async saveRefreshToken(refreshTokenCredentials: {
    userId: number;
    refreshToken: string;
    family: string;
    browserInfo?: string;
  }): Promise<void> {
    const expiresAt = getTokenExpirationDate();

    await this.prismaService.userTokens.create({
      data: { ...refreshTokenCredentials, expiresAt },
    });
  }
}
