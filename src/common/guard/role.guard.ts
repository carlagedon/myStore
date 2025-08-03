import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { IS_ADMIN_KEY } from '../decorator/isAdmon.decorator';
import { Request } from 'express';
import { CurrentUser } from '../interface/currentUser.interface';

/** Проверяет, является ли пользователь администратором */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /** Если пользователь админ то пропускаемм если нет то не пропускаем */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUser | undefined;

    // console.log(request, 'user in role.guard.ts');

    if (isAdmin && user?.userRole === Role.ADMIN) {
      return true;
    }

    return false;
  }
}
