import { Controller, Get, Param } from '@nestjs/common';
import { PendingPoliciesService } from './pending-policy.service';

@Controller('plans/:planId/pending-policy')
export class PendingPoliciesController {
  constructor(private readonly pendingPolicyService: PendingPoliciesService) {}

  @Get()
  async findByPlan(@Param('planId') planId: string) {
    const data = await this.pendingPolicyService.findByPlan(planId);
    return { message: 'Pending Policies Successfully fetched', data };
  }
}
