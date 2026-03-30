import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PendingPolicy } from './models/pending-policy.model';
// import { PendingPoliciesController } from './pending-policies.controller';
// import { PendingPoliciesService } from './pending-policies.service';
import { PendingPoliciesService } from './pending-policy.service';
import { PendingPoliciesController } from './pending-policies-controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [SequelizeModule.forFeature([PendingPolicy]), ProductsModule],
  controllers: [PendingPoliciesController],
  providers: [PendingPoliciesService],
  exports: [SequelizeModule, PendingPoliciesService],
})
export class PendingPoliciesModule {}
