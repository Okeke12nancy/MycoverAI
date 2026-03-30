import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsService } from './products.service';
import { Product } from './models/product.model';

const mockProduct = {
  id: 1,
  name: 'Optimal Care Mini',
  price: 10000,
  category: { id: 1, name: 'Health' },
};

const mockProductModel = {
  findAll: jest.fn().mockResolvedValue([mockProduct]),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getModelToken(Product), useValue: mockProductModel },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products with their categories', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Optimal Care Mini');
    expect(mockProductModel.findAll).toHaveBeenCalledTimes(1);
  });
});
