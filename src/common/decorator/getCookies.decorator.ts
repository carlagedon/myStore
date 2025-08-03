import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// ** Декоратор для получения cookies из запроса **
export const Cookies = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data ? request.cookies?.[data] : request.cookies;
  },
);
