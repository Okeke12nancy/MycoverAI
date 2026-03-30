import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PlanService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    const data = await this.planService.createPlan(createPlanDto);
    return { message: 'Plan has been successfully purchased', data };
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    const data = await this.planService.findAll(userId);
    return { message: 'Plans successfully fetched', data };
  }
}
