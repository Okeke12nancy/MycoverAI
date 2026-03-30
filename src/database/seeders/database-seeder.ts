import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory } from 'src/modules/products-category/models/product-category';
import { Product } from '../../modules/products/models/product.model';
import { User } from '../../modules/users/models/user.model';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectModel(ProductCategory)
    private readonly categoryModel: typeof ProductCategory,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedCategories();
    await this.seedProducts();
    await this.seedUsers();
  }

  private async seedCategories(): Promise<void> {
    const categories = ['Health', 'Auto'];

    for (const name of categories) {
      await this.categoryModel.findOrCreate({ where: { name } });
    }

    this.logger.log('Product categories seeded');
  }

  private async seedProducts(): Promise<void> {
    const healthCategory = await this.categoryModel.findOne({
      where: { name: 'Health' },
    });
    const autoCategory = await this.categoryModel.findOne({
      where: { name: 'Auto' },
    });

    if (!healthCategory || !autoCategory) {
      this.logger.error(
        'Required categories not found, skipping product seeding',
      );
      return;
    }

    const products = [
      {
        name: 'Optimal Care Mini',
        price: 10000,
        categoryId: healthCategory.id,
      },
      {
        name: 'Optimal Care Standard',
        price: 20000,
        categoryId: healthCategory.id,
      },
      {
        name: 'Third-Party',
        price: 5000,
        categoryId: autoCategory.id,
      },
      {
        name: 'Comprehensive',
        price: 15000,
        categoryId: autoCategory.id,
      },
    ];

    for (const product of products) {
      await this.productModel.findOrCreate({
        where: { name: product.name },
        defaults: product,
      });
    }

    this.logger.log('Products seeded');
  }

  private async seedUsers(): Promise<void> {
    const users = [
      { name: 'John Doe', email: 'john@example.com', walletBalance: 500000 },
      { name: 'Jane Smith', email: 'jane@example.com', walletBalance: 300000 },
      { name: 'Bob Johnson', email: 'bob@example.com', walletBalance: 150000 },
    ];

    for (const user of users) {
      await this.userModel.findOrCreate({
        where: { email: user.email },
        defaults: user,
      });
    }

    this.logger.log('Users seeded');
  }
}
