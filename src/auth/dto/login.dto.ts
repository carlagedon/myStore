import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
// ** Описывает информацию, необходимую для аутентификации пользователя в приложении */
export class LoginDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
