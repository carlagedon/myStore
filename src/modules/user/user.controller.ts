import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { Public } from 'src/common/decorator/public.decorator';
import { IsAdmin } from 'src/common/decorator/isAdmon.decorator';
import { UserWithoutPasswordDto } from './dto/userWithoutPassword.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorator/getCurrentUser.decorator';
import { RemoveUserDto } from './dto/removeUser.dto';

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
  async findUserByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.userService.findUserByEmail(email);
  }

  @Public()
  @Post('find-by-id/:id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserWithoutPasswordDto | null> {
    return await this.userService.findById(id);
  }

  @IsAdmin()
  @Patch('role')
  async updateRole(
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<UserWithoutPasswordDto> {
    return await this.userService.updatingUserRole(updateRoleDto);
  }

  @ApiBearerAuth()
  @Delete('')
  async removeUser(
    @GetCurrentUser('userId') userId: number,
    @Body() removeUserDto: RemoveUserDto,
  ) {
    await this.userService.removeUser(removeUserDto, userId);
  }
}
