import { Prisma } from '@prisma/client';

/** Описывает свойства категории в базе данных. */
export class CategoryEntity implements Prisma.CategoryCreateInput {
  /**
   * Category ID
   * @example 1
   */
  id?: string;

  /**
   * Имя категории
   * @example "Электроника"
   */
  name: string;
}
