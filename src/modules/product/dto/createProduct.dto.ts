import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateProductDto extends OmitType(ProductEntity, [
  'id',
  'createdAt',
  'urlName',
  'picture',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Iphone',
  })
  name: string;

  @ApiProperty({
    example: 1234,
  })
  @IsNumber()
  @IsNotEmpty()
  basePrice: string | number | Decimal;

  @ApiProperty({
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  discountPercentage?: number;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: 'Ара черный айфон ара покупай брат',
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Category ID
   * Тут мы прлучаем только Id а не весь массив целиком
   */
  @ApiProperty({
    example: [1],
    description: 'Указываем к каким категориям относится продукт',
  })
  @IsOptional()
  @IsArray()
  categories?: number[];
}
