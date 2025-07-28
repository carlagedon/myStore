import ms from 'ms';

/**
 * Этот код нужен для того, чтобы строковое значение времени жизни токена
 * превратить в конкретную дату истечения
 * токена с которой удобно работать в TypeScript и базе данных
 */

export function getTokenExpirationDate(): Date {
  const expiresIn = process.env.JWT_REFRESH_EXPIRATION_TIME;
  if (!expiresIn) {
    throw new Error('JWT_REFRESH_EXPIRATION_TIME не установлен');
  }
  const expiresInMs = ms(expiresIn as ms.StringValue);
  if (typeof expiresInMs !== 'number') {
    throw new Error('Неверный формат JWT_REFRESH_EXPIRATION_TIME');
  }
  const expiresInDays = expiresInMs / 1000 / 60 / 60 / 24;
  return addDaysFromNow(expiresInDays);
}

/** Добавить количество дней к сегодняшней дате */
function addDaysFromNow(days: number): Date {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
}
