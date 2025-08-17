import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { IsAdmin } from 'src/common/decorator/isAdmon.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Public()
  @IsAdmin()
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }
}
