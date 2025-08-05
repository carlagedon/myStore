import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { UserWithoutPasswordDto } from './dto/userWithoutPassword.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RemoveUserDto } from './dto/removeUser.dto';

// осталось сделать обновленеи пользователя имя и т.д
@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.findUserByEmail(dto.email);
    if (user) {
      throw new HttpException('Пользователь с таки email уже существует', 400);
    }

    const hashPasword = await hash(dto.password, 10);

    return await this.prismaService.user.create({
      data: {
        ...dto,
        password: hashPasword,
      },
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPasswordDto> {
    await this.hashIfUpdatingPassword(id, updateUserDto);

    const user = await this.prismaService.user.update({
      where: { id },
      data: { ...updateUserDto, updatedAt: new Date() },
    });

    // Исключить пароль из возвращаемого объекта пользователя
    // опять же проблема в том тчо я не создал entity и не описал его, потому что prisma возвращает null а ждут undefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      name: user.name ?? undefined,
      address: user.address ?? undefined,
    };
  }

  // Вобще что бы не было проблем с типами надо было создать entity что бы не было посстоянных проблем стипами между ts и prisma
  // ** Это функция обновляет роль пользователя */
  async updatingUserRole(
    updateRoleDto: UpdateRoleDto,
  ): Promise<UserWithoutPasswordDto> {
    const user = await this.prismaService.user.update({
      where: { email: updateRoleDto.email },
      data: { role: updateRoleDto.role },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;

    return {
      ...rest,
      name: user.name ?? undefined,
      address: user.address ?? undefined,
    } as UserWithoutPasswordDto;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async removeUser(removeUserDto: RemoveUserDto, id: number): Promise<void> {
    await this.validateCurrrentPassord(id, removeUserDto.currentPassword);

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: number): Promise<UserWithoutPasswordDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Пользователь с таким id не найден', 404);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return {
      ...rest,
    } as UserWithoutPasswordDto;
  }

  // Тут мы проверяем текущий пароль пользователя
  // Если пароль не совпадает, то выбрасываем ошибку
  // Если пароль совпадает, то ничего не делаем
  private async validateCurrrentPassord(
    id: number,
    currentPassword: string,
  ): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('Пользователь с таким id не найден', 404);
    }

    if (!user.password) {
      throw new HttpException('Пользователь не имеет пароля', 400);
    }
    console.log(`user.password: ${user.password}`);
    console.log(`currentPassword: ${currentPassword}`);

    const isCurrentPassword = await compare(currentPassword, user.password);

    if (!isCurrentPassword) {
      throw new HttpException('Неверный текущий пароль', 400);
    }
  }

  // Метод для хеширования пароля при обновлении пользователя
  // Если передан текущий пароль, то проверяем его
  // Если текущий пароль совпадает, то хешируем новый пароль
  // Если текущий пароль не совпадает, то выбрасываем ошибку
  private async hashIfUpdatingPassword(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    if (updateUserDto.password && updateUserDto.currentPassword) {
      await this.validateCurrrentPassord(id, updateUserDto.currentPassword);

      const hashPassword = await hash(updateUserDto.currentPassword, 10);

      updateUserDto.password = hashPassword;
      delete updateUserDto.currentPassword;

      return;
    }

    if (updateUserDto.password || updateUserDto.currentPassword) {
      throw new HttpException(
        'Для обновления пароля необходимо указать текущий пароль',
        400,
      );
    }
  }
}
