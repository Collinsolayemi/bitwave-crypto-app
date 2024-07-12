import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GenerateWalletDto {
  @ApiProperty()
  @IsString()
  label: string;
}
