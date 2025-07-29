/**
 * Базовая обертка для ошибок
 */
export class AuthServiceInputException extends Error {
  /**
   * Создает экземпляр AuthServiceInputException, и расширяет базовый класс Error.
   */
  constructor(message: string) {
    super(message);
  }
}
