import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class UpdateRoleDto extends PickType(CreateUserDto, ['email', 'role']) {}
