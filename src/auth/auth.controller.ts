/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { ValidateDto } from './dto/validate.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Этот метод используется для валидации пользователя по email и паролю.
  // И он закомментирован, так как это являлось проверкой на работоспособность.

  // @Post('validate')
  // async validateUser(
  //   @Body() validateDto: ValidateDto,
  // ): Promise<Omit<User, 'password'>> {
  //   return await this.authService.validateUser(
  //     validateDto.email,
  //     validateDto.password,
  //   );
  // }

  // Это просто яяляется проверкой на работоспособность JWT
  // В реальном приложении этот метод не нужен, так как токен будет генерироваться
  // при логине пользователя и храниться на клиенте, а не генерироваться
  // по запросу от клиента.

  // @Post('generate-access-token')
  // async generateAccessToken(
  //   @Body() payload: { sub: string; userRole: string },
  // ) {
  //   return await this.authService.generateAccessToken(payload);
  // }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }
}
