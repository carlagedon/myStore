/** Что возвращается в приложение после проверки Access JsonWebToken*/
export type AccessTokenContent = {
  /** Id пользователя
   * @example "d6c24523-12df-4f33-9fd6-44dd5c499084"
   */
  userId: number;

  /** Роль пользователя
   * @example "user"
   */
  userRole: string;
};
