import { Prisma } from '@prisma/client';

/** Описывает свойства продукта в базе данных. */
export class ProductEntity implements Prisma.ProductCreateInput {
  /**
   * Product ID
   * @example 1
   */
  id?: number;

  /**
   * Название продукта
   * @example "Iphone black 128gb"
   */
  name: string;

  /**
   * Название продукта преобразовано в URL
   * @example "Iphone-black-128gb"
   */
  urlName: string;

  /**
   * Картинка продукта
   * @example "image.jpg"
   */
  picture?: string;

  /**
   *Цена товара без учёта скидок.
   * Сохранено в десятичном формате, расчёты следует выполнять
   * с помощью currency.js
   * @example 70.00
   */
  basePrice: string | number | Prisma.Decimal;

  /**
   * Скидка на товар в процентах. По умолчанию 0.
   * @example 10
   */
  discountPercentage?: number;

  /** Остаток товара на складе. По умолчанию 0.
   * @example 42
   */
  stock?: number;

  /**
   * Описание продукта
   * @example "Черный Iphone не нужданется в представлении(Покупайте его черные работают лучше)"
   */
  description?: string;

  /**
   * Product createdAt dateString
   * @example "2022-03-26T15:41:28.527Z"
   */
  createdAt?: string | Date;
}
