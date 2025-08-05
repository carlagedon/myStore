import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// export class RemoveUserDto extends PickType(UpdateUserDto, [
//   'currentPassword',
// ]) {}

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Пароль',
    example: 'password123',
  })
  currentPassword: string;
}
