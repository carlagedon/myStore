import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { IsAdmin } from 'src/common/decorator/isAdmon.decorator';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { FindCategoryDto } from './dto/findCategory.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { FindProductsDto } from '../product/dto/findProduct.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @IsAdmin()
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get('/findAll')
  async findAll(
    @Query() findCategoryDto: FindCategoryDto,
  ): Promise<Category[]> {
    return await this.categoryService.findAll(findCategoryDto);
  }

  @Public()
  @Get('findById/:id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Query() findProductsDto: FindProductsDto,
  ) {
    return this.categoryService.findById(id, findProductsDto);
  }

  @Public()
  @Get('findByName/:name')
  async findByName(
    @Param('name') name: string,
    @Query() findProductsDto: FindProductsDto,
  ) {
    return this.categoryService.findOneByName(name, findProductsDto);
  }

  @Public()
  @Patch('/updateCategory/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Public()
  @Delete('/deleteCategory/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.removeCategory(id);
  }
}
