import { ConfigService } from '@nestjs/config';
import { getTokenExpirationDateForCookie } from './tokenExpirationDateForCookie';
import { Response } from 'express';

// ** Функция для слздания куки */
export function setCookie(
  res: Response,
  nameToken: string,
  configService: ConfigService,
  token: string,
  expirationTime: string,
) {
  res.cookie(configService.getOrThrow<string>(nameToken), token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: getTokenExpirationDateForCookie(
      configService.getOrThrow<string>(expirationTime),
    ),
  });
}

// ** Функция для очищения куки */
export function clearCookie(
  res: Response,
  configService: ConfigService,
  nameToken: string,
) {
  res.clearCookie(configService.getOrThrow<string>(nameToken));
}
