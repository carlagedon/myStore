import ms from 'ms';
/**
 * Этот код нужен для того, чтобы строковое значение времени жизни токена
 * превратить в конкретную дату истечения для куки
 */
export function getTokenExpirationDateForCookie(value: string): number {
  const expiresInMs = ms(value as ms.StringValue);

  return expiresInMs;
}
