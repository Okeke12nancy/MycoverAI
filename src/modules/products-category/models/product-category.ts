import {
  Column,
  Table,
  HasMany,
  DataType,
  Model,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Product } from 'src/modules/products/models/product.model';

@Table({ tableName: 'product-categories', underscored: true })
export class ProductCategory extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => Product)
  declare products: Product[];
}
