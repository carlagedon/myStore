import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserTokens } from '@prisma/client';
import { compare } from 'bcrypt';
import { PrismaService } from 'src/config/db/prisma.service';

import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidV4 } from 'uuid';

import { getTokenExpirationDate } from 'src/utils/getTokenExpirationDate';
import { LoginResponse } from './dto/login.response';
import { RefreshTokenPayload } from 'src/types/refresh-token-payload';
import { InvalidRefreshTokenException } from 'src/types/exceptions/invalid-refresh-token.exception';
import {
  ACCESS_JWT_SERVICE,
  REFRESH_JWT_SERVICE,
} from 'src/config/jwt.provider.factory';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    @Inject(ACCESS_JWT_SERVICE) private readonly jwtAccess: JwtService,
    @Inject(REFRESH_JWT_SERVICE) private readonly jwtRefresh: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = { sub: user.id, userRole: user.role };

    const accessToken = await this.generateAccessToken(payload);

    const refreshToken = await this.generateRefreshToken({ sub: payload.sub });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const refreshTokenContent: RefreshTokenPayload =
      await this.jwtRefresh.verifyAsync(refreshToken);

    await this.validateRefreshToken(refreshToken, refreshTokenContent);

    const userRole = await this.getUserRole(refreshTokenContent.sub);

    const accessToken = await this.generateAccessToken({
      sub: refreshTokenContent.sub,
      userRole,
    });

    const newRefreshToken = await this.rotateRefreshToken(
      refreshToken,
      refreshTokenContent,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private async rotateRefreshToken(
    refreshToken: string,
    refreshTokenContent: RefreshTokenPayload,
  ): Promise<string> {
    await this.prismaService.userTokens.deleteMany({ where: { refreshToken } });

    const newRefreshToken = await this.generateRefreshToken({
      sub: refreshTokenContent.sub,
      tokenFamily: refreshTokenContent.tokenFamily,
    });

    return newRefreshToken;
  }

  private async validateRefreshToken(
    refreshToken: string,
    refreshTokenContent: RefreshTokenPayload,
  ): Promise<boolean> {
    const userTokens = await this.prismaService.userTokens.findMany({
      where: { userId: refreshTokenContent.sub, refreshToken },
    });

    const isRefreshTokenValid = userTokens.length > 0;

    if (!isRefreshTokenValid) {
      await this.removeRefreshTokenFamilyIfCompromised(
        refreshTokenContent.sub,
        refreshTokenContent.tokenFamily,
      );

      throw new InvalidRefreshTokenException();
    }

    return true;
  }

  private async removeRefreshTokenFamilyIfCompromised(
    userId: number,
    tokenFamily: string,
  ): Promise<void> {
    const familyTokens = await this.prismaService.userTokens.findMany({
      where: { userId, family: tokenFamily },
    });

    if (familyTokens.length > 0) {
      await this.prismaService.userTokens.deleteMany({
        where: { userId, family: tokenFamily },
      });
    }
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

    const refreshToken = await this.jwtRefresh.signAsync({ ...payload });

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

  private async getUserRole(userId: number): Promise<string> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpException('Пользователь с таким id не найден', 404);
    }

    return user.role;
  }

  //** Удаление refresh токена, в следсвии чего
  // с помощью этой сессии нельязя будет
  // войти ещё раз т.к нет refresh токена
  //   */
  async logout(refreshToken: string): Promise<void> {
    await this.prismaService.userTokens.deleteMany({
      where: { refreshToken },
    });
  }

  //** Удаляем все токены */
  async logoutAll(userId: number): Promise<void> {
    await this.prismaService.userTokens.deleteMany({
      where: { userId },
    });
  }

  //** Получаем все токены пользователя */
  async findAllTokens(userId: number): Promise<UserTokens[]> {
    const tokens = await this.prismaService.userTokens.findMany({
      where: { userId },
    });

    return tokens;
  }

  // TODO: Сделать гуард для ролей
}
