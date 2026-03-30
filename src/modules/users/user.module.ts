import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [SequelizeModule, UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
