import {
  Column,
  Table,
  HasMany,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Policy } from 'src/modules/policies/models/policies.model';
import { User } from 'src/modules/users/models/user.model';
import { Product } from 'src/modules/products/models/product.model';
import { PendingPolicy } from 'src/modules/pending-policies/models/pending-policy.model';

@Table({ tableName: 'plans', underscored: true })
export class Plan extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false })
  declare productId: string;

  @BelongsTo(() => Product)
  declare product: Product;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare totalAmount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @HasMany(() => PendingPolicy)
  declare pendingPolicies: PendingPolicy[];

  @HasMany(() => Policy)
  declare policies: Policy[];
}
