import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Post('find-by-email/:email')
  async findUserByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.userService.findUserByEmail(email);
  }
}
