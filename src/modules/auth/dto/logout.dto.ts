import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

/** Описывает информацию, необходимую для выхода пользователя из приложения. */
export class LogoutDto {
  /**
   * User refresh token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
   */
  @ApiProperty({
    description: 'Refresh токен для выхода из системы',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsInRva2VuRmFtaWx5IjoiZmNlMTlkNzktYTNkYS00YmViLTgyODItZGE1MjM3NTI5YTJiIiwiaWF0IjoxNzUzOTcxMzQ1LCJleHAiOjE3NjE3NDczNDV9.83mOnBCrk4ufeE9UQfMC_mVYiiSbs0WE3fl6-D-dLAo',
  })
  @IsJWT()
  refreshToken: string;
}
