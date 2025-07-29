/** Содержания расшифрованого access */
export type AccessTokenPayload = {
  /** ID пользователя
   * в будущем будет в формате UUID, пока что используется числовой ID
   * @example 1
   * @example "d6c24523-12df-4f33-9fd6-44dd5c499084"
   */
  sub: number;

  /** Роль пользователя
   * @example "user"
   */
  userRole: string;
};
