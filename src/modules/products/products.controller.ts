import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  async findAll() {
    const data = await this.productService.findAll();
    return { message: 'Products retrieved successfully', data };
  }
}
