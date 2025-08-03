import { Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { Public } from 'src/common/decorator/public.decorator';
import { IsAdmin } from 'src/common/decorator/isAdmon.decorator';
import { GetCurrentUser } from 'src/common/decorator/getCurrentUser.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('create')
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @IsAdmin()
  @Post('find-by-email/:email')
  async findUserByEmail(
    @Param('email') email: string,
    @GetCurrentUser('userId') userRole: string,
  ): Promise<User | null> {
    console.log(`Admin Role: ${userRole}, Email: ${email}`);

    return await this.userService.findUserByEmail(email);
  }
}
