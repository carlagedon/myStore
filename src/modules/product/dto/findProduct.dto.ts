import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindProductsDto {
  @ApiProperty({
    description: 'Название продукта',
    example: 'Iphone',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiProperty({
    description: 'Страница продукта',
    example: 1,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({
    description: 'Сколько нам нужно пропустить в бд',
    nullable: true,
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  offset?: number;
}
