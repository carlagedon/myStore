import { AuthServiceInputException } from './auth-service-input.exception';

/** Используется, когда пользователь вводит неправильный адрес электронной почты
 * или пароль при попытке входа в систему.
 */
export class InvalidEmailOrPasswordException extends AuthServiceInputException {
  /** Выдаёт исключение с сообщением «Неверный адрес электронной почты или пароль».
   *
   * Используется, когда пользователь вводит неправильный адрес электронной почты
   * или пароль при попытке входа в систему.
   */
  constructor() {
    super('Неверный адрес электронной почты или пароль');
  }
}
