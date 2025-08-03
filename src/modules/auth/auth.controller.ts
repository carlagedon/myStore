import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login.response';
import { Public } from '../../common/decorator/public.decorator';
import { Response } from 'express';
import { getTokenExpirationDateForCookie } from 'src/utils/tokenExpirationDateForCookie';
import { LogoutDto } from './dto/logout.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessJwtGuard } from './access.jwt.guard';
import { GetCurrentUser } from 'src/common/decorator/getCurrentUser.decorator';
import { CurrentUser } from 'src/common/interface/currentUser.interface';
import { setCookie, clearCookie } from 'src/utils/cookie.setting';
import { Cookies } from 'src/common/decorator/getCookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  //** Эндпоинт для логина */
  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // Устанавливаем куки с токенами
    setCookie(
      res,
      'ACCESS_COOKIE_NAME',
      this.configService,
      accessToken,
      'JWT_ACCESS_EXPIRATION_TIME',
    );

    setCookie(
      res,
      'REFRESH_COOKIE_NAME',
      this.configService,
      refreshToken,
      'JWT_REFRESH_EXPIRATION_TIME',
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    // вообще я принимаю имена куки с конфига, но проблема в том что я в декораторе не могу получить значение из конфига
    // поэтому я просто передаю имя куки в декоратор Cookies, хотя это не совсем правильно
    @Cookies('refreshToken')
    refreshTokenNow: RefreshTokenDto['refreshTokenNow'],
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(refreshTokenNow);

    setCookie(
      res,
      'ACCESS_COOKIE_NAME',
      this.configService,
      accessToken,
      'JWT_ACCESS_EXPIRATION_TIME',
    );

    setCookie(
      res,
      'REFRESH_COOKIE_NAME',
      this.configService,
      refreshToken,
      'JWT_REFRESH_EXPIRATION_TIME',
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  //** Эндпоинт для логаута */
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @Cookies('refreshToken')
    refreshTokenNow: RefreshTokenDto['refreshTokenNow'],
    @Res({ passthrough: true }) res: Response,
  ) {
    clearCookie(res, this.configService, 'ACCESS_COOKIE_NAME');

    await this.authService.logout(refreshTokenNow);
  }

  //** Эндпоинт для логаута всех устройств */
  @ApiBearerAuth()
  @Post('logout-all')
  async logoutAll(@GetCurrentUser('userId') userId: number) {
    await this.authService.logoutAll(userId);
  }

  // ** Эндпоинт для получения всех токенов пользователя */
  @ApiBearerAuth()
  @Get('tokens')
  async getTokens(@GetCurrentUser('userId') userId: number) {
    return this.authService.findAllTokens(userId);
  }
}
