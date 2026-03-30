import {
  Table,
  Column,
  DataType,
  HasMany,
  Model,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { PendingPolicy } from 'src/modules/pending-policies/models/pending-policy.model';
import { ProductCategory } from 'src/modules/products-category/models/product-category';

@Table({ tableName: 'products', underscored: true })
export class Product extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  declare price: number;

  @ForeignKey(() => ProductCategory)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare categoryId: string;

  @BelongsTo(() => ProductCategory)
  declare category: ProductCategory;

  @HasMany(() => PendingPolicy)
  declare pendingPolicies: PendingPolicy[];
}
