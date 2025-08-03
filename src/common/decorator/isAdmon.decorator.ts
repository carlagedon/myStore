import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../guard/role.guard';

/** Задает метаданные для проверки роли администратора */
export const IS_ADMIN_KEY = 'isAdmin';

/** Делает метод контроллера доступным только для администраторов */
export function IsAdmin(): <TFunction>(
  target: object | TFunction,
  propertyKey?: string | symbol,
) => void {
  return applyDecorators(
    SetMetadata(IS_ADMIN_KEY, true),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
  );
}
