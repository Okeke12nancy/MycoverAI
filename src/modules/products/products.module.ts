import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductCategory } from '../products-category/models/product-category';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
@Module({
  imports: [SequelizeModule.forFeature([Product, ProductCategory])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [SequelizeModule, ProductsService],
})
export class ProductsModule {}
