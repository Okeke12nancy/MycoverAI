import { IsString } from 'class-validator';
export class ActivatePolicyDto {
  @IsString()
  userId!: string;
}
