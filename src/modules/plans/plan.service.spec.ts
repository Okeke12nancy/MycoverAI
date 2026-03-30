import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { PlanService } from './plans.service';
import { Plan } from './models/plan.model';
import { User } from '../users/models/user.model';
import { Product } from '../products/models/product.model';
import { PendingPolicy } from '../pending-policies/models/pending-policy.model';
import { Policy } from '../policies/models/policies.model';

const mockUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const mockProductId = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
const mockPlanId = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

const mockUser = {
  id: mockUserId,
  walletBalance: 500000,
  update: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
};

const mockProduct = {
  id: mockProductId,
  price: 10000,
};

const mockPlan = {
  id: mockPlanId,
  userId: mockUserId,
  productId: mockProductId,
  totalAmount: 20000,
  quantity: 2,
};

const mockTransaction = {
  commit: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
  rollback: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
};

const mockSequelize = {
  transaction: jest
    .fn()
    .mockImplementation((cb: (t: Transaction) => Promise<unknown>) =>
      cb(mockTransaction as unknown as Transaction),
    ),
};

const mockUserModel = {
  findByPk: jest.fn<Promise<typeof mockUser | null>, [string]>(),
};

const mockProductModel = {
  findByPk: jest.fn<Promise<typeof mockProduct | null>, [string]>(),
};

const mockPlanModel = {
  create: jest.fn<Promise<typeof mockPlan>, []>(),
  findByPk: jest.fn<Promise<typeof mockPlan | null>, [string]>(),
};

const mockPendingPolicyModel = {
  bulkCreate: jest.fn<Promise<[]>, []>().mockResolvedValue([]),
};

const mockPolicyModel = {
  findAll: jest.fn<Promise<[]>, []>().mockResolvedValue([]),
};

describe('PlansService', () => {
  let service: PlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanService,
        { provide: getModelToken(Plan), useValue: mockPlanModel },
        { provide: getModelToken(User), useValue: mockUserModel },
        { provide: getModelToken(Product), useValue: mockProductModel },
        {
          provide: getModelToken(PendingPolicy),
          useValue: mockPendingPolicyModel,
        },
        { provide: getModelToken(Policy), useValue: mockPolicyModel },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if user is not found', async () => {
    mockUserModel.findByPk.mockResolvedValue(null);
    await expect(
      service.createPlan({
        userId: 'non-existent-uuid',
        productId: mockProductId,
        quantity: 1,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if product is not found', async () => {
    mockUserModel.findByPk.mockResolvedValue(mockUser);
    mockProductModel.findByPk.mockResolvedValue(null);
    await expect(
      service.createPlan({
        userId: mockUserId,
        productId: 'non-existent-uuid',
        quantity: 1,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if wallet balance is insufficient', async () => {
    mockUserModel.findByPk.mockResolvedValue({
      ...mockUser,
      walletBalance: 100,
    });
    mockProductModel.findByPk.mockResolvedValue(mockProduct);
    await expect(
      service.createPlan({
        userId: mockUserId,
        productId: mockProductId,
        quantity: 2,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a plan and deduct wallet balance', async () => {
    const userWithUpdate = {
      ...mockUser,
      walletBalance: 500000,
      update: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
    };
    mockUserModel.findByPk.mockResolvedValue(userWithUpdate);
    mockProductModel.findByPk.mockResolvedValue(mockProduct);
    mockPlanModel.create.mockResolvedValue(mockPlan);
    mockPlanModel.findByPk.mockResolvedValue(mockPlan);
    mockPendingPolicyModel.bulkCreate.mockResolvedValue([]);

    const result = await service.createPlan({
      userId: mockUserId,
      productId: mockProductId,
      quantity: 2,
    });

    expect(userWithUpdate.update).toHaveBeenCalledWith(
      { walletBalance: 480000 },
      expect.anything(),
    );
    expect(mockPlanModel.create).toHaveBeenCalled();
    expect(mockPendingPolicyModel.bulkCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          planId: mockPlanId,
          productId: mockProductId,
        }),
      ]),
      expect.anything(),
    );
    expect(result).toEqual(mockPlan);
  });
});
