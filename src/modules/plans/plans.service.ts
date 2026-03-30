import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Plan } from './models/plan.model';
import { User } from '../users/models/user.model';
import { Product } from '../products/models/product.model';
import { PendingPolicy } from '../pending-policies/models/pending-policy.model';
import { Policy } from '../policies/models/policies.model';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan) private readonly planModel: typeof Plan,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(PendingPolicy)
    private readonly pendingPolicyModel: typeof PendingPolicy,
    private readonly sequelize: Sequelize,
  ) {}

  async createPlan(dto: CreatePlanDto): Promise<Plan> {
    const { userId, productId, quantity } = dto;

    const user = await this.userModel.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');

    const product = await this.productModel.findByPk(productId);
    if (!product) throw new NotFoundException('Product not found');

    const totalAmount = Number(product.price) * quantity;

    if (Number(user.walletBalance) < totalAmount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    return this.sequelize.transaction(async (transaction) => {
      await user.update(
        { walletBalance: Number(user.walletBalance) - totalAmount },
        { transaction },
      );

      const plan = await this.planModel.create(
        { userId, productId, totalAmount, quantity },
        { transaction },
      );

      const slots = Array.from({ length: quantity }, () => ({
        planId: plan.id,
        productId,
      }));

      await this.pendingPolicyModel.bulkCreate(slots, { transaction });

      return this.planModel.findByPk(plan.id, {
        include: [
          {
            model: User,
            attributes: ['userId', 'name', 'email', 'walletBalance'],
          },
          { model: Product, attributes: ['id', 'name', 'price'] },
          { model: PendingPolicy },
          { model: Policy },
        ],
        transaction,
      }) as Promise<Plan>;
    });
  }

  async findAll(userId?: string): Promise<Plan[]> {
    const where: { userId?: string } = {};
    if (userId) where.userId = userId;

    return this.planModel.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'walletBalance'] },
        { model: Product, attributes: ['id', 'name', 'price'] },
        { model: PendingPolicy },
        { model: Policy },
      ],
    });
  }
}
