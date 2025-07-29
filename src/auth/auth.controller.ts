import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Res } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './dto/login.response';
import { Public } from './public.decorator';
import { Response } from 'express';
import { getTokenExpirationDateForCookie } from 'src/utils/tokenExpirationDateForCookie';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // return await this.authService.login(dto);

    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: getTokenExpirationDateForCookie(
        this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRATION_TIME'),
      ),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<LoginResponse> {
    return this.authService.refreshToken(refreshToken);
  }
}
