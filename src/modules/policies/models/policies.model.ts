import {
  Model,
  Table,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Plan } from 'src/modules/plans/models/plan.model';
import { Product } from 'src/modules/products/models/product.model';
import { User } from 'src/modules/users/models/user.model';

@Table({
  tableName: 'policies',
  underscored: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'],
    },
  ],
})
export class Policy extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare policyNumber: string;

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

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;
}
