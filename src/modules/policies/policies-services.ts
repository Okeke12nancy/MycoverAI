import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Policy } from './models/policies.model';
import {
  PendingPolicy,
  PendingPolicyStatus,
} from '../pending-policies/models/pending-policy.model';
import { PendingPoliciesService } from '../pending-policies/pending-policy.service';
import { User } from '../users/models/user.model';
import { Product } from '../products/models/product.model';
import { ProductCategory } from '../products-category/models/product-category';
import { ActivatePolicyDto } from './dto/activate-policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy) private readonly policyModel: typeof Policy,
    @InjectModel(PendingPolicy)
    private readonly pendingPolicyModel: typeof PendingPolicy,
    private readonly pendingPoliciesService: PendingPoliciesService,
    private readonly sequelize: Sequelize,
  ) {}

  async activatePolicy(
    pendingPolicyId: string,
    dto: ActivatePolicyDto,
  ): Promise<Policy> {
    try {
      const { userId } = dto;

      const pendingPolicy =
        await this.pendingPoliciesService.findOneUnused(pendingPolicyId);

      console.log('pendingPolicy found:', pendingPolicy.id);

      const existingPolicy = await this.policyModel.findOne({
        where: {
          userId,
          productId: pendingPolicy.productId,
        },
      });

      if (existingPolicy) {
        throw new BadRequestException(
          'User already has a policy for this product',
        );
      }

      return this.sequelize.transaction(async (transaction) => {
        const policyNumber = `PL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

        const policy = await this.policyModel.create(
          {
            policyNumber,
            planId: pendingPolicy.planId,
            productId: pendingPolicy.productId,
            userId,
          },
          { transaction },
        );

        console.log('policy created:', policy.id);

        const freshPendingPolicy = await this.pendingPolicyModel.findOne({
          where: { id: pendingPolicy.id },
          transaction,
        });

        if (!freshPendingPolicy) {
          throw new NotFoundException('Pending policy not found');
        }

        await freshPendingPolicy.update(
          { status: PendingPolicyStatus.USED },
          { transaction },
        );
        await freshPendingPolicy.destroy({ transaction });

        console.log('pending policy soft deleted');

        return this.policyModel.findByPk(policy.id, {
          include: [
            { model: User, attributes: ['userId', 'name', 'email'] },
            {
              model: Product,
              attributes: ['id', 'name', 'price'],
            },
          ],
          transaction,
        }) as Promise<Policy>;
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('activatePolicy error:', error.message);
        console.error('full error:', error);
      } else {
        console.error('unknown error:', error);
      }
      throw error;
    }
  }

  async findAll(planId?: string): Promise<Policy[]> {
    const where: { planId?: string } = {};
    if (planId) where.planId = planId;

    return this.policyModel.findAll({
      where,
      include: [
        { model: User, attributes: ['userId', 'name', 'email'] },
        {
          model: Product,
          attributes: ['id', 'name', 'price'],
          include: [{ model: ProductCategory, attributes: ['id', 'name'] }],
        },
      ],
    });
  }

  // async findAll(planId?: string): Promise<Policy[]> {
  //   const where: { planId?: string } = {};
  //   if (planId) where.planId = planId;

  //   return this.policyModel.findAll({
  //     where,
  //     include: [
  //       { model: User, attributes: ['id', 'name', 'email'] },
  //       {
  //         model: Product,
  //         attributes: ['id', 'name', 'price'],
  //         include: [{ model: ProductCategory, attributes: ['id', 'name'] }],
  //       },
  //     ],
  //   });
  // }
}
