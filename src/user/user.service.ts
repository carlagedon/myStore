import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
