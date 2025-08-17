import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

/** Описывает информацию для поиска по категориям */
export class FindCategoryDto {
  /** Указываем имя категории которую хотим найти
   * @example "Электроника"
   */
  @IsOptional()
  @IsString()
  categoryName?: string;

  /** Какую старинцу категории будет показывать (Пагинация)
   * @example 1
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  /** Сколько обектов категории берем (Тоже часть пагинации)
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  offset?: number;
}
