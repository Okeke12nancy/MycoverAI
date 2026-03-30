import {
  Model,
  Table,
  Column,
  BelongsTo,
  ForeignKey,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Product } from 'src/modules/products/models/product.model';
import { Plan } from 'src/modules/plans/models/plan.model';

export enum PendingPolicyStatus {
  UNUSED = 'unused',
  USED = 'used',
}

@Table({ tableName: 'pending_policies', underscored: true, paranoid: true })
export class PendingPolicy extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Plan)
  @Column({ type: DataType.UUID, allowNull: false })
  declare planId: string;

  @BelongsTo(() => Plan)
  declare plan: Plan;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @BelongsTo(() => Product)
  declare product: Product;

  @Column({
    type: DataType.ENUM(...Object.values(PendingPolicyStatus)),
    allowNull: false,
    defaultValue: PendingPolicyStatus.UNUSED,
  })
  declare status: PendingPolicyStatus;
}
