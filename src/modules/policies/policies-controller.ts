import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { PoliciesService } from './policies-services';
import { ActivatePolicyDto } from './dto/activate-policy.dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Patch('activate/:pendingPolicyId')
  @HttpCode(HttpStatus.CREATED)
  async activate(
    @Param('pendingPolicyId') pendingPolicyId: string,
    @Body() dto: ActivatePolicyDto,
  ) {
    const data = await this.policiesService.activatePolicy(
      pendingPolicyId,
      dto,
    );
    return { message: 'Policy activated successfully', data };
  }

  @Get()
  async findAll(@Query('planId') planId?: string) {
    const data = await this.policiesService.findAll(
      planId ? planId : undefined,
    );
    return { message: 'Policies fetched successfully', data };
  }
}
