import { ApiProperty } from '@nestjs/swagger';

export class ValidateDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'JonDoe2@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  password: string;
}
