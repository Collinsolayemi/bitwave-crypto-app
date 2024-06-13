import { IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsUUID()
  userId: string;

  @IsString()
  @IsOptional()
  additionalDetails?: string;
}
