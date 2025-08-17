import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/createProduct.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/config/db/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const urlName = this.formatUrlName(createProductDto.name);

    const categoryies = this.connectCategoriesById(
      createProductDto.categories || [],
    );

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        urlName,
        categories: categoryies,
      },
      include: { categories: { select: { name: true } } },
    });

    return product;
  }

  private connectCategoriesById(
    categories: number[],
  ): Prisma.CategoryCreateNestedManyWithoutProductsInput {
    let categoriesConnection = { connect: [] as { id: number }[] };

    if (categories) {
      categoriesConnection = {
        connect: categories.map((category) => {
          return { id: category };
        }),
      };
    }
    return categoriesConnection;
  }

  private formatUrlName(name: string): string {
    const lowerCaseUrlName = name.toLocaleLowerCase();
    const trimmedUrlName = lowerCaseUrlName.trim();
    const singleSpaceUrlName = trimmedUrlName.replace(/\s\s+/g, ' ');
    const spaceToHyphenUrlName = singleSpaceUrlName.split(' ').join('-');

    return spaceToHyphenUrlName;
  }
}
