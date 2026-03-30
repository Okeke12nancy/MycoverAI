import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PendingPolicy } from './models/pending-policy.model';
import { Product } from '../products/models/product.model';
import { ProductCategory } from '../products-category/models/product-category';
import { PendingPolicyStatus } from './models/pending-policy.model';

@Injectable()
export class PendingPoliciesService {
  constructor(
    @InjectModel(PendingPolicy)
    private readonly pendingPolicyModel: typeof PendingPolicy,
  ) {}

  async findByPlan(planId: string): Promise<PendingPolicy[]> {
    const pendingPolicies = await this.pendingPolicyModel.findAll({
      where: { planId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price'],
          include: [{ model: ProductCategory, attributes: ['id', 'name'] }],
        },
      ],
    });

    if (!pendingPolicies.length) {
      throw new NotFoundException('No pending policies found for this plan');
    }

    return pendingPolicies;
  }

  async findOneUnused(id: string): Promise<PendingPolicy> {
    const pendingPolicy = await this.pendingPolicyModel.findOne({
      where: { id, status: PendingPolicyStatus.UNUSED },
      include: [{ model: Product }],
    });

    if (!pendingPolicy) {
      throw new NotFoundException(
        'Pending policy not found or already activated',
      );
    }

    return pendingPolicy;
  }
}
