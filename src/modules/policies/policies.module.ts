import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Policy } from './models/policies.model';
import { PendingPoliciesModule } from '../pending-policies/pending-policy.module';
import { UsersModule } from '../users/user.module';
import { ProductsModule } from '../products/products.module';
import { PlansModule } from '../plans/plans.module';
import { PoliciesController } from './policies-controller';
import { PoliciesService } from './policies-services';
import { ProductCategory } from '../products-category/models/product-category';
import { User } from '../users/models/user.model';
import { Product } from '../products/models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Policy, Product, ProductCategory, User]),
    PendingPoliciesModule,
    UsersModule,
    ProductsModule,
    forwardRef(() => PlansModule),
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService],
  exports: [PoliciesService],
})
export class PoliciesModule {}
