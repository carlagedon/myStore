import { IsString } from 'class-validator';
import { CategoryEntity } from '../entities/categoryEntity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto implements CategoryEntity {
  @ApiProperty({
    example: 'Электроника',
    description: 'Название категории',
  })
  @IsString()
  name: string;
}
