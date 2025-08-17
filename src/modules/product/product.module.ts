import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/config/db/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
