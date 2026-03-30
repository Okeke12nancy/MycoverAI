import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './modules/users/models/user.model';
import { ProductCategory } from './modules/products-category/models/product-category';
import { Product } from './modules/products/models/product.model';
import { Plan } from './modules/plans/models/plan.model';
import { PendingPolicy } from './modules/pending-policies/models/pending-policy.model';
import { Policy } from './modules/policies/models/policies.model';
import { ProductsModule } from './modules/products/products.module';
import { PendingPoliciesModule } from './modules/pending-policies/pending-policy.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { PlansModule } from './modules/plans/plans.module';
import { UsersModule } from './modules/users/user.module';
import { DatabaseSeeder } from './database/seeders/database-seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        models: [User, ProductCategory, Product, Plan, PendingPolicy, Policy],
        autoLoadModels: true,
        sync: { alter: true },
        logging: false,
      }),
    }),
    SequelizeModule.forFeature([
      User,
      ProductCategory,
      Product,
      Plan,
      PendingPolicy,
      Policy,
    ]),
    UsersModule,
    ProductsModule,
    PlansModule,
    PendingPoliciesModule,
    PoliciesModule,
  ],
  providers: [DatabaseSeeder],
})
export class AppModule {}
