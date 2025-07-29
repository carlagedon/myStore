import { AuthServiceInputException } from './auth-service-input.exception';

/** Используется, когда пользователь вводит недействительный токен
 * при обновлении
 */
export class InvalidRefreshTokenException extends AuthServiceInputException {
  /** Выдаёт исключение с сообщением «Неверный токен обновления».
   *
   * Используется, когда пользователь вводит неверный токен
   * при обновлении
   */
  constructor() {
    super('Неверный refresh token');
  }
}
