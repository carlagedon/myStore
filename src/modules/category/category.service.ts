import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { FindCategoryDto } from './dto/findCategory.dto';
import { FindProductsDto } from '../product/dto/findProduct.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategory: CreateCategoryDto): Promise<Category> {
    const name = this.capitalizeOnlyFirstLetter(createCategory.name);

    return await this.prisma.category.create({
      data: { name },
    });
  }

  async findAll({
    categoryName = '',
    page = 1,
    offset = 10,
  }: FindCategoryDto): Promise<Category[]> {
    const categoriesToSkip = (page - 1) * offset;

    return this.prisma.category.findMany({
      skip: categoriesToSkip,
      take: offset,
      where: {
        name: { contains: categoryName, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
    });
  }

  // Когда мы находим категорию нам так же отдаются продукты
  async findById(
    id: number,
    { productName = '', page = 1, offset = 10 }: FindProductsDto,
  ) {
    const productsToSkip = (page - 1) * offset;

    return await this.prisma.category.findUniqueOrThrow({
      where: { id },
      include: {
        products: {
          select: { id: true, name: true, urlName: true, picture: true },
          where: { name: { contains: productName, mode: 'insensitive' } },
          skip: productsToSkip,
          take: offset,
        },
      },
    });
  }

  // тут самое главное на front части name правильно указывать,
  // то етсь человек ищит категорию в поиске, поиск есть на фронте,
  // он написл 2 буквы нашел категорию, каторая надо нажимает на неё и потом полное имя передатся сюда и все
  async findOneByName(
    name: string,
    { productName = '', page = 1, offset = 10 }: FindProductsDto,
  ): Promise<Category> {
    const productsToSkip = (page - 1) * offset;

    name = this.capitalizeOnlyFirstLetter(name);

    const category = await this.prisma.category.findUniqueOrThrow({
      where: { name },
      include: {
        products: {
          select: { id: true, name: true, urlName: true, picture: true },
          where: { name: { contains: productName, mode: 'insensitive' } },
          skip: productsToSkip,
          take: offset,
        },
      },
    });

    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (updateCategoryDto.name) {
      return await this.updateCategoryAndName(id, updateCategoryDto);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });

    return category;
  }

  async removeCategory(id: number) {
    await this.prisma.category.delete({
      where: { id },
    });

    return `Успешно было удалена категория с id ${id}`;
  }

  // ** Создает первую букву заглавной */
  private capitalizeOnlyFirstLetter(name: string): string {
    return name[0].toUpperCase() + name.substring(1).toLocaleLowerCase();
  }

  // Это просто вспомогательная функция её делать асинхронйо не буду,
  // просто буду дожидатся её в функции update
  private updateCategoryAndName(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (!updateCategoryDto.name) {
      throw new HttpException('Передайте имя на которое хотите  изменить', 400);
    }
    const name = this.capitalizeOnlyFirstLetter(updateCategoryDto.name);
    return this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto, name },
    });
  }
}
