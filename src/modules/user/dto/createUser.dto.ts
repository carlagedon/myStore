import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @ApiProperty({
    description: 'Email пользователя',
    example: 'JonDoe@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Jon Doe',
  })
  @IsNotEmpty({ message: 'Имя не должен быть пустым' })
  @IsString()
  name?: string | undefined;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @IsString()
  @MinLength(6, {
    message: 'Пароль должен быть не менее 6 символов',
  })
  password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Адрес пользователя',
    example: '123 Main St, Springfield',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Роль пользователя',
    example: Role.ADMIN,
  })
  role?: Role;
}
