import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Plan } from './models/plan.model';
import { UsersModule } from '../users/user.module';
import { ProductsModule } from '../products/products.module';
import { PendingPoliciesModule } from '../pending-policies/pending-policy.module';
import { PlansController } from './plans.controller';
import { PlanService } from './plans.service';
import { PoliciesModule } from '../policies/policies.module';
@Module({
  imports: [
    SequelizeModule.forFeature([Plan]),
    UsersModule,
    ProductsModule,
    PendingPoliciesModule,
    forwardRef(() => PoliciesModule),
  ],
  controllers: [PlansController],
  providers: [PlanService],
  exports: [SequelizeModule],
})
export class PlansModule {}
