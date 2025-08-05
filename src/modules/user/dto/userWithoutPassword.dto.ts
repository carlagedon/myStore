import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UserWithoutPasswordDto extends OmitType(CreateUserDto, [
  'password',
]) {}
