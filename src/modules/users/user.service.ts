import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async findAll(): Promise<User[]> {
    try {
      console.log('findAll called');
      const users = await this.userModel.findAll({
        attributes: ['userId', 'name', 'email', 'walletBalance'],
      });
      console.log('users found:', users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}
