import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from '../interface/currentUser.interface';

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof CurrentUser | undefined,
    ctx: ExecutionContext,
  ): CurrentUser | CurrentUser[keyof CurrentUser] | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as CurrentUser | undefined;
    return data ? user?.[data] : user;
  },
);
