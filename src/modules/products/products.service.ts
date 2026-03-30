import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductCategory } from '../products-category/models/product-category';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll({
      include: [
        {
          model: ProductCategory,
          attributes: ['id', 'name'],
        },
      ],
    });
  }
}
